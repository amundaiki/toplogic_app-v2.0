const express = require('express');
const { v4: uuidv4 } = require('uuid');
const claudeService = require('../services/claudeService');
const webhookService = require('../services/webhookService');
const requestTracker = require('../utils/requestTracker');
const logger = require('../utils/logger');
const authenticate = require('../middleware/auth');
const { claudeApiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Input validation middleware
const validateClaudeRequest = (req, res, next) => {
  const { prompt, webhookUrl } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'prompt is required and must be a non-empty string'
    });
  }

  if (!webhookUrl || typeof webhookUrl !== 'string') {
    return res.status(400).json({
      error: 'Validation error',
      message: 'webhookUrl is required and must be a string'
    });
  }

  // Basic URL validation
  try {
    new URL(webhookUrl);
  } catch (error) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'webhookUrl must be a valid URL'
    });
  }

  next();
};

// POST /api/claude - Main async Claude API endpoint
router.post('/claude', authenticate, claudeApiLimiter, validateClaudeRequest, async (req, res) => {
  let { prompt, webhookUrl, requestId: clientRequestId, options = {} } = req.body;

  // Parse options if it's a string (from form-data)
  if (typeof options === 'string') {
    try {
      options = JSON.parse(options);
    } catch (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'options must be valid JSON'
      });
    }
  }

  const requestId = clientRequestId || uuidv4();

  logger.info('Received Claude API request', {
    requestId,
    promptLength: prompt.length,
    webhookUrl,
    options,
    allBodyKeys: Object.keys(req.body)
  });

  // Store entire request body for passing through to webhook
  const originalRequest = { ...req.body };

  logger.info('Original request fields to pass through', {
    requestId,
    originalRequestKeys: Object.keys(originalRequest),
    action: originalRequest.action,
    opplaster: originalRequest.opplaster,
    leverandor: originalRequest.leverandor
  });

  // Store request in tracker
  requestTracker.create(requestId, {
    prompt,
    webhookUrl,
    options,
    originalRequest,
    status: 'pending'
  });

  // Return immediately with 202 Accepted
  res.status(202).json({
    message: 'Request accepted and processing',
    requestId,
    status: 'pending',
    timestamp: new Date().toISOString()
  });

  // Process Claude API call in background
  processClaudeRequest(requestId, prompt, webhookUrl, options, originalRequest);
});

// Background processing function
async function processClaudeRequest(requestId, prompt, webhookUrl, options, originalRequest = {}) {
  try {
    logger.info('Starting background Claude API processing', { requestId });

    // Update status to processing
    requestTracker.update(requestId, { status: 'processing' });

    // Call Claude API
    const result = await claudeService.sendMessage(prompt, options);

    if (result.success) {
      logger.info('Claude API processing successful', {
        requestId,
        responseLength: result.response.length
      });

      // Update tracker
      requestTracker.update(requestId, {
        status: 'completed',
        response: result.response,
        usage: result.usage
      });

      // Send success callback to Make.com with original request data
      await webhookService.sendCompletionCallback(
        webhookUrl,
        requestId,
        result.response,
        {
          usage: result.usage,
          model: result.model,
          stopReason: result.stopReason,
          // Pass through all original request fields (except sensitive data)
          ...Object.fromEntries(
            Object.entries(originalRequest).filter(([key]) =>
              !['prompt', 'webhookUrl', 'options'].includes(key)
            )
          )
        }
      );

    } else {
      throw new Error(result.error || 'Claude API request failed');
    }

  } catch (error) {
    logger.error('Background Claude API processing failed', {
      requestId,
      error: error.message
    });

    // Update tracker
    requestTracker.update(requestId, {
      status: 'failed',
      error: error.message
    });

    // Send error callback to Make.com
    await webhookService.sendErrorCallback(
      webhookUrl,
      requestId,
      error.message
    );
  }
}

// GET /api/status/:requestId - Check request status
router.get('/status/:requestId', authenticate, (req, res) => {
  const { requestId } = req.params;

  logger.debug('Status check requested', { requestId });

  const request = requestTracker.get(requestId);

  if (!request) {
    return res.status(404).json({
      error: 'Not found',
      message: 'Request not found',
      requestId
    });
  }

  // Don't send back the full prompt and response in status check
  const { prompt, response, ...statusData } = request;

  res.json({
    requestId,
    ...statusData,
    promptLength: prompt ? prompt.length : 0,
    responseLength: response ? response.length : 0
  });
});

module.exports = router;
