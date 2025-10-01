const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Default error status
  const status = err.status || err.statusCode || 500;

  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production'
    ? 'An internal error occurred'
    : err.message;

  res.status(status).json({
    error: 'Internal Server Error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  logger.warn('Route not found', {
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
