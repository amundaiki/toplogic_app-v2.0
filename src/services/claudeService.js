const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.maxRetries = 3;
    this.timeout = 30 * 60 * 1000; // 30 minutes
  }

  async sendMessage(prompt, options = {}) {
    const {
      model = 'claude-3-5-sonnet-20241022',
      maxTokens = 4096,
      temperature = 1,
      systemPrompt = null
    } = options;

    logger.info('Starting Claude API request', {
      model,
      maxTokens,
      promptLength: prompt.length
    });

    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    const requestParams = {
      model,
      max_tokens: maxTokens,
      messages,
      ...(systemPrompt && { system: systemPrompt })
    };

    if (temperature !== undefined) {
      requestParams.temperature = temperature;
    }

    return await this.makeRequestWithRetry(requestParams);
  }

  async makeRequestWithRetry(params, retryCount = 0) {
    try {
      const response = await Promise.race([
        this.client.messages.create(params),
        this.timeoutPromise(this.timeout)
      ]);

      logger.info('Claude API request successful', {
        model: params.model,
        usage: response.usage
      });

      return {
        success: true,
        response: response.content[0].text,
        usage: response.usage,
        model: response.model,
        stopReason: response.stop_reason
      };

    } catch (error) {
      logger.error('Claude API request failed', {
        attempt: retryCount + 1,
        error: error.message,
        errorType: error.constructor.name
      });

      // Check if we should retry
      if (this.shouldRetry(error) && retryCount < this.maxRetries) {
        const delay = this.calculateBackoff(retryCount);
        logger.info(`Retrying after ${delay}ms`, { attempt: retryCount + 1 });

        await this.sleep(delay);
        return this.makeRequestWithRetry(params, retryCount + 1);
      }

      // No more retries or non-retryable error
      throw this.formatError(error);
    }
  }

  async sendMessageStream(prompt, onChunk, options = {}) {
    const {
      model = 'claude-3-5-sonnet-20241022',
      maxTokens = 4096,
      temperature = 1,
      systemPrompt = null
    } = options;

    logger.info('Starting Claude API streaming request', {
      model,
      maxTokens,
      promptLength: prompt.length
    });

    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    const requestParams = {
      model,
      max_tokens: maxTokens,
      messages,
      stream: true,
      ...(systemPrompt && { system: systemPrompt })
    };

    if (temperature !== undefined) {
      requestParams.temperature = temperature;
    }

    let fullResponse = '';
    let usage = null;
    let stopReason = null;

    try {
      const stream = await this.client.messages.create(requestParams);

      for await (const event of stream) {
        if (event.type === 'content_block_delta') {
          const chunk = event.delta.text;
          fullResponse += chunk;
          if (onChunk) {
            onChunk(chunk);
          }
        } else if (event.type === 'message_delta') {
          usage = event.usage;
          stopReason = event.delta.stop_reason;
        }
      }

      logger.info('Claude API streaming request successful', {
        model,
        responseLength: fullResponse.length,
        usage
      });

      return {
        success: true,
        response: fullResponse,
        usage,
        model,
        stopReason
      };

    } catch (error) {
      logger.error('Claude API streaming request failed', {
        error: error.message,
        errorType: error.constructor.name
      });
      throw this.formatError(error);
    }
  }

  shouldRetry(error) {
    // Retry on rate limits, timeouts, and server errors
    if (error.status) {
      return error.status === 429 || error.status >= 500;
    }

    // Retry on network errors
    return error.code === 'ECONNRESET' ||
           error.code === 'ETIMEDOUT' ||
           error.code === 'ENOTFOUND';
  }

  calculateBackoff(retryCount) {
    // Exponential backoff: 2^retryCount * 1000ms (1s, 2s, 4s, 8s, ...)
    return Math.min(Math.pow(2, retryCount) * 1000, 30000);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  timeoutPromise(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), ms);
    });
  }

  formatError(error) {
    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      errorType: error.constructor.name,
      status: error.status || 500,
      ...(error.response && { details: error.response })
    };
  }
}

module.exports = new ClaudeService();
