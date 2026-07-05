'use strict';

const logger = require('../config/logger');

/**
 * Global Express error handler.
 * Must be the LAST middleware registered in app.js (4 parameters).
 * Catches errors forwarded by asyncHandler or explicit next(err) calls.
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  // Log the full error internally
  logger.error(`[Error] ${req.method} ${req.originalUrl} — ${err.message}`, err);

  // Determine HTTP status
  const status = err.statusCode || err.status || 500;

  // Never leak stack traces to the client in production
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Something went wrong';

  res.status(status).json({ success: false, error: message });
}

module.exports = errorMiddleware;
