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

  // Return immediately with 202 Accepted and jobId
  res.status(202).json({
    success: true,
    jobId: requestId, // Use requestId as jobId (unique per file)
    batchId: originalRequest.batchId || requestId, // batchId for grouping multiple files
    fileName: originalRequest.fileName || 'unknown',
    status: 'received',
    message: 'Request accepted and processing',
    timestamp: new Date().toISOString()
  });

  // Process Claude API call in background
  processClaudeRequest(requestId, prompt, webhookUrl, options, originalRequest);
});

// Background processing function
async function processClaudeRequest(requestId, prompt, webhookUrl, options, originalRequest = {}) {
  try {
    logger.info('Starting background Claude API processing', { requestId });

    // Stage 1: Extract text from PDF (simulated - you'll do actual PDF parsing)
    requestTracker.update(requestId, {
      status: 'processing',
      stage: 'extracting_text',
      progress: 33
    });
    logger.info('Processing stage: extracting_text', { requestId });

    // Small delay to simulate PDF text extraction (remove in production if instant)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Stage 2: AI Analysis
    requestTracker.update(requestId, {
      status: 'processing',
      stage: 'ai_analysis',
      progress: 66
    });
    logger.info('Processing stage: ai_analysis', { requestId });

    // Call Claude API
    const result = await claudeService.sendMessage(prompt, options);

    if (result.success) {
      logger.info('Claude API processing successful', {
        requestId,
        responseLength: result.response.length
      });

      // Parse response to extract supplier name if available
      let detectedSupplier = null;
      try {
        // Try to extract supplier from the response
        const jsonMatch = result.response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          detectedSupplier = parsed['1'] || parsed.leverandor || parsed.supplier;
        }
      } catch (e) {
        logger.debug('Could not parse supplier from response', { requestId });
      }

      // Update tracker with completed status
      requestTracker.update(requestId, {
        status: 'completed',
        stage: 'completed',
        progress: 100,
        response: result.response,
        usage: result.usage,
        detectedSupplier
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

// OPTIONS /api/status/:requestId - Handle preflight request
router.options('/status/:requestId', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(204);
});

// GET /api/status/:requestId - Check request status (for polling)
router.get('/status/:requestId', (req, res) => {
  const { requestId } = req.params;

  // Set CORS headers explicitly for this endpoint
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  logger.debug('Status check requested', { requestId });

  const request = requestTracker.get(requestId);

  if (!request) {
    return res.status(404).json({
      jobId: requestId,
      status: 'not_found',
      message: 'Job not found or expired'
    });
  }

  // Return job status in format expected by frontend
  res.json({
    jobId: requestId,
    batchId: request.originalRequest?.batchId || requestId,
    status: request.status,
    stage: request.stage || request.status,
    progress: request.progress || 0,
    fileName: request.originalRequest?.fileName || 'unknown',
    detectedSupplier: request.detectedSupplier,
    sheetUrl: request.sheetUrl, // Will be set by Make.com callback if needed
    timestamp: request.updatedAt || request.createdAt
  });
});

module.exports = router;
