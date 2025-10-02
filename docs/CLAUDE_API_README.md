# Claude Async API - Production-Ready Backend

A robust Node.js Express backend for handling asynchronous Claude API calls from Make.com. This service accepts API requests, processes them in the background, and sends results back via webhooks.

## Features

- ✅ **Async Processing**: Immediate 202 response with background Claude API processing
- ✅ **Webhook Callbacks**: Automatic callbacks to Make.com with results
- ✅ **Retry Logic**: Smart exponential backoff for both Claude API and webhook calls
- ✅ **Long-Running Support**: Handles requests up to 30 minutes
- ✅ **Security**: API key authentication, rate limiting, input sanitization
- ✅ **Production Ready**: Comprehensive error handling, logging, health checks
- ✅ **Railway Compatible**: Easy deployment with Docker support

## Architecture

```
┌─────────────┐      POST /api/claude       ┌──────────────┐
│             │ ──────────────────────────> │              │
│  Make.com   │                             │  This API    │
│             │ <──── 202 Accepted ─────────│              │
└─────────────┘                             └──────┬───────┘
      ▲                                            │
      │                                            │
      │                                            ▼
      │                                     ┌──────────────┐
      │                                     │   Claude     │
      │                                     │   API        │
      │                                     └──────┬───────┘
      │                                            │
      │                                            │
      └──────── Webhook callback ──────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- Anthropic API key
- Make.com account (for webhooks)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd claude-async-api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
ANTHROPIC_API_KEY=sk-ant-xxxxx
API_SECRET_KEY=your-secure-secret-key
PORT=3000
NODE_ENV=development
```

5. Create logs directory:
```bash
mkdir logs
```

6. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### POST /api/claude

Initiates an async Claude API request.

**Headers:**
```
Content-Type: application/json
X-API-Key: your-api-secret-key
```

**Request Body:**
```json
{
  "prompt": "Explain quantum computing in simple terms",
  "webhookUrl": "https://hook.us1.make.com/your-webhook-id",
  "requestId": "optional-custom-id",
  "options": {
    "model": "claude-3-5-sonnet-20241022",
    "maxTokens": 4096,
    "temperature": 1,
    "systemPrompt": "You are a helpful assistant"
  }
}
```

**Response (202 Accepted):**
```json
{
  "message": "Request accepted and processing",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Webhook Callback (Success):**
```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "response": "Quantum computing is...",
  "status": "completed",
  "timestamp": "2024-01-15T10:35:00.000Z",
  "usage": {
    "input_tokens": 15,
    "output_tokens": 500
  },
  "model": "claude-3-5-sonnet-20241022",
  "stopReason": "end_turn"
}
```

**Webhook Callback (Error):**
```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "error": "Rate limit exceeded",
  "status": "failed",
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

### GET /api/status/:requestId

Check the status of a request.

**Headers:**
```
X-API-Key: your-api-secret-key
```

**Response:**
```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:32:00.000Z",
  "promptLength": 42,
  "responseLength": 0
}
```

### GET /health

Health check endpoint (no authentication required).

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "environment": "production"
}
```

## Make.com Integration Guide

### Setup Workflow

1. **Create a new scenario in Make.com**

2. **Add HTTP module to trigger the API:**
   - Method: POST
   - URL: `https://your-api-url.railway.app/api/claude`
   - Headers:
     - `Content-Type`: `application/json`
     - `X-API-Key`: Your API secret key
   - Body:
     ```json
     {
       "prompt": "{{your_prompt}}",
       "webhookUrl": "{{webhook_url}}",
       "requestId": "{{unique_id}}"
     }
     ```

3. **Add a Webhook module to receive results:**
   - Create a new webhook in Make.com
   - Copy the webhook URL
   - Use this URL as `webhookUrl` in your API requests

4. **Process the webhook response:**
   - The webhook will receive either success or error data
   - Check `status` field: "completed" or "failed"
   - Extract `response` field for successful requests
   - Extract `error` field for failed requests

### Example Make.com Scenario

```
┌─────────────────┐
│  Trigger        │
│  (Schedule/     │
│   Webhook/etc)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  HTTP Request   │
│  POST /api/     │
│  claude         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Webhook        │
│  (Wait for      │
│   callback)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Router         │
│  (Check status) │
└─────┬─────┬─────┘
      │     │
  Success  Error
      │     │
      ▼     ▼
 [Process] [Handle]
 [Result]  [Error]
```

## Deployment to Railway.app

### Method 1: Direct Deployment

1. **Create Railway account** at [railway.app](https://railway.app)

2. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

3. **Login to Railway:**
```bash
railway login
```

4. **Initialize project:**
```bash
railway init
```

5. **Add environment variables:**
```bash
railway variables set ANTHROPIC_API_KEY=sk-ant-xxxxx
railway variables set API_SECRET_KEY=your-secure-key
railway variables set NODE_ENV=production
```

6. **Deploy:**
```bash
railway up
```

### Method 2: GitHub Integration

1. Push your code to GitHub
2. Go to Railway dashboard
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables in Railway dashboard
6. Railway will automatically deploy

### Railway Configuration

Railway automatically detects Node.js apps. The following will be configured automatically:
- Build command: `npm install`
- Start command: `npm start`
- Port: Automatically assigned (don't hardcode PORT in .env)

### Environment Variables in Railway

Set these in Railway dashboard:
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
API_SECRET_KEY=your-secure-secret-key
NODE_ENV=production
ALLOWED_ORIGINS=https://hook.us1.make.com,https://hook.eu1.make.com
LOG_LEVEL=info
```

## Docker Deployment

### Build and Run Locally

```bash
# Build image
docker build -t claude-async-api .

# Run container
docker run -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-ant-xxxxx \
  -e API_SECRET_KEY=your-secret-key \
  -e NODE_ENV=production \
  claude-async-api
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - API_SECRET_KEY=${API_SECRET_KEY}
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 3s
      retries: 3
```

Run with:
```bash
docker-compose up -d
```

## Testing

### Test Health Endpoint

```bash
curl http://localhost:3000/health
```

### Test Claude API Endpoint

```bash
curl -X POST http://localhost:3000/api/claude \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-secret-key" \
  -d '{
    "prompt": "What is 2+2?",
    "webhookUrl": "https://webhook.site/your-unique-url"
  }'
```

**Note:** Use [webhook.site](https://webhook.site) to create a temporary webhook URL for testing.

### Test Status Endpoint

```bash
curl http://localhost:3000/api/status/YOUR_REQUEST_ID \
  -H "X-API-Key: your-api-secret-key"
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | - | Your Anthropic API key |
| `API_SECRET_KEY` | Yes | - | Secret key for API authentication |
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment (development/production) |
| `ALLOWED_ORIGINS` | No | * | CORS allowed origins (comma-separated) |
| `LOG_LEVEL` | No | info | Logging level (error/warn/info/debug) |

### Rate Limiting

Default rate limits:
- Claude API endpoint: 100 requests per 15 minutes per IP
- General endpoints: 200 requests per 15 minutes per IP

Modify in `src/middleware/rateLimiter.js`.

### Timeout Settings

- Claude API timeout: 30 minutes
- Webhook callback timeout: 30 seconds
- Retry attempts: 3 for both Claude API and webhooks

Modify in respective service files.

## Project Structure

```
claude-async-api/
├── src/
│   ├── middleware/
│   │   ├── auth.js              # API key authentication
│   │   ├── rateLimiter.js       # Rate limiting configuration
│   │   └── errorHandler.js      # Global error handling
│   ├── routes/
│   │   ├── claudeRoutes.js      # Claude API routes
│   │   └── healthRoutes.js      # Health check routes
│   ├── services/
│   │   ├── claudeService.js     # Claude API integration
│   │   └── webhookService.js    # Webhook callback handling
│   ├── utils/
│   │   ├── logger.js            # Winston logger configuration
│   │   └── requestTracker.js    # In-memory request tracking
│   └── server.js                # Express app & server setup
├── logs/                        # Application logs (created at runtime)
├── .env.example                 # Environment variables template
├── .gitignore
├── Dockerfile                   # Docker configuration
├── .dockerignore
├── package.json
├── docs/
│   ├── CLAUDE_API_README.md     # This file
│   ├── MAKE_SCENARIO_GUIDE.md
│   └── CHANGELOG.md
├── test/                        # Test files and examples
│   ├── test-frontend.html
│   ├── test-faktura-prompt.json
│   └── example-133-fields-full.json
├── blueprints/                  # Make.com blueprints
│   ├── Toplogic faktura 1.blueprint.json
│   └── Toplogic faktura 2.blueprint.json
└── archive/                     # Legacy files (archived)
```

## Error Handling

The API handles various error scenarios:

### Client Errors (4xx)
- `400 Bad Request`: Invalid input (missing/invalid fields)
- `401 Unauthorized`: Missing API key
- `403 Forbidden`: Invalid API key
- `404 Not Found`: Request ID not found
- `429 Too Many Requests`: Rate limit exceeded

### Server Errors (5xx)
- `500 Internal Server Error`: Unexpected errors
- Automatic retry with exponential backoff for:
  - Claude API rate limits (429)
  - Claude API server errors (5xx)
  - Network errors (ECONNRESET, ETIMEDOUT, etc.)
  - Webhook delivery failures

## Logging

Logs are written to:
- `logs/error.log`: Error-level logs only
- `logs/combined.log`: All logs
- Console: Development environment only

Log format: JSON with timestamps

Example log entry:
```json
{
  "level": "info",
  "message": "Claude API request successful",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "usage": {"input_tokens": 15, "output_tokens": 500},
  "timestamp": "2024-01-15 10:35:22",
  "service": "claude-async-api"
}
```

## Security Best Practices

1. **API Keys**: Never commit `.env` file. Use strong, unique keys.
2. **CORS**: Configure `ALLOWED_ORIGINS` to restrict access.
3. **Rate Limiting**: Adjust limits based on your needs.
4. **HTTPS**: Always use HTTPS in production (Railway provides this automatically).
5. **Secrets**: Use Railway's secret management or environment variables.
6. **Monitoring**: Regularly check logs for suspicious activity.

## Monitoring & Maintenance

### Health Checks
- Endpoint: `GET /health`
- Railway automatically monitors this endpoint
- Returns uptime and system status

### Log Monitoring
```bash
# View Railway logs
railway logs

# Follow logs in real-time
railway logs --follow
```

### Request Cleanup
- Old requests (>24 hours) are automatically cleaned up every hour
- Prevents memory leaks from in-memory tracking

## Troubleshooting

### Common Issues

**Issue: "Missing required environment variables"**
- Solution: Ensure all required env vars are set in `.env` or Railway dashboard

**Issue: "Authentication required"**
- Solution: Include `X-API-Key` header in all requests to protected endpoints

**Issue: "Webhook callback failed"**
- Solution: Verify webhook URL is accessible and returns 2xx status codes
- Check Railway logs for detailed error messages

**Issue: "Request timeout"**
- Solution: Claude API can take up to 30 minutes for complex requests
- Verify Anthropic API key is valid
- Check Anthropic API status

**Issue: Railway deployment fails**
- Solution: Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

## Performance Considerations

- **Memory**: In-memory request tracking. For high volume, consider Redis.
- **Scaling**: Railway can auto-scale. Enable in project settings.
- **Concurrency**: Node.js handles multiple requests efficiently.
- **Database**: For persistent storage, integrate MongoDB or PostgreSQL.

## Future Enhancements

Potential improvements:
- [ ] Redis for distributed request tracking
- [ ] Database integration for request history
- [ ] Metrics and monitoring dashboard
- [ ] WebSocket support for real-time updates
- [ ] Multi-turn conversation support
- [ ] Request queuing system
- [ ] Admin dashboard for monitoring

## Support

For issues or questions:
1. Check logs in `logs/` directory
2. Review Railway dashboard logs
3. Verify environment configuration
4. Test with webhook.site for debugging

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

---

**Built with ❤️ for seamless Claude API integration with Make.com**
