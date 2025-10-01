const axios = require('axios');
const logger = require('../utils/logger');

class WebhookService {
  constructor() {
    this.maxRetries = 3;
    this.timeout = 30000; // 30 seconds
  }

  async sendCallback(webhookUrl, data, retryCount = 0) {
    logger.info('Sending webhook callback', {
      url: webhookUrl,
      requestId: data.requestId,
      status: data.status,
      attempt: retryCount + 1
    });

    try {
      const response = await axios.post(webhookUrl, data, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Claude-Async-API/1.0'
        },
        validateStatus: (status) => status < 500 // Don't throw on 4xx errors
      });

      if (response.status >= 200 && response.status < 300) {
        logger.info('Webhook callback successful', {
          url: webhookUrl,
          requestId: data.requestId,
          status: response.status
        });
        return { success: true, status: response.status };
      } else {
        logger.warn('Webhook callback returned error status', {
          url: webhookUrl,
          requestId: data.requestId,
          status: response.status,
          data: response.data
        });
        throw new Error(`Webhook returned status ${response.status}`);
      }

    } catch (error) {
      logger.error('Webhook callback failed', {
        url: webhookUrl,
        requestId: data.requestId,
        attempt: retryCount + 1,
        error: error.message
      });

      // Retry logic
      if (retryCount < this.maxRetries && this.shouldRetry(error)) {
        const delay = this.calculateBackoff(retryCount);
        logger.info(`Retrying webhook after ${delay}ms`, {
          url: webhookUrl,
          attempt: retryCount + 1
        });

        await this.sleep(delay);
        return this.sendCallback(webhookUrl, data, retryCount + 1);
      }

      // All retries exhausted
      logger.error('Webhook callback failed after all retries', {
        url: webhookUrl,
        requestId: data.requestId,
        totalAttempts: retryCount + 1
      });

      return {
        success: false,
        error: error.message,
        attempts: retryCount + 1
      };
    }
  }

  async sendCompletionCallback(webhookUrl, requestId, response, metadata = {}) {
    const payload = {
      requestId,
      batchId: requestId, // Include batchId for Make.com compatibility
      response,
      status: 'completed',
      timestamp: new Date().toISOString(),
      ...metadata
    };

    return this.sendCallback(webhookUrl, payload);
  }

  async sendErrorCallback(webhookUrl, requestId, error, metadata = {}) {
    const payload = {
      requestId,
      batchId: requestId, // Include batchId for Make.com compatibility
      error: typeof error === 'string' ? error : error.message,
      status: 'failed',
      timestamp: new Date().toISOString(),
      ...metadata
    };

    return this.sendCallback(webhookUrl, payload);
  }

  shouldRetry(error) {
    // Don't retry on client errors (4xx)
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return false;
    }

    // Retry on network errors and server errors (5xx)
    return !error.response ||
           error.code === 'ECONNRESET' ||
           error.code === 'ETIMEDOUT' ||
           error.code === 'ENOTFOUND' ||
           error.response.status >= 500;
  }

  calculateBackoff(retryCount) {
    // Exponential backoff: 2^retryCount * 1000ms
    return Math.min(Math.pow(2, retryCount) * 1000, 10000);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new WebhookService();
