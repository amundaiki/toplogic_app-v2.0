const logger = require('../utils/logger');

const authenticate = (req, res, next) => {
  const apiKey = req.header('X-API-Key');

  if (!apiKey) {
    logger.warn('Authentication failed: No API key provided', {
      ip: req.ip,
      path: req.path
    });
    return res.status(401).json({
      error: 'Authentication required',
      message: 'X-API-Key header is missing'
    });
  }

  if (apiKey !== process.env.API_SECRET_KEY) {
    logger.warn('Authentication failed: Invalid API key', {
      ip: req.ip,
      path: req.path
    });
    return res.status(403).json({
      error: 'Authentication failed',
      message: 'Invalid API key'
    });
  }

  logger.debug('Authentication successful', { ip: req.ip, path: req.path });
  next();
};

module.exports = authenticate;
