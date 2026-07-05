'use strict';

/**
 * Wraps an async Express route handler so that any thrown error
 * is automatically forwarded to next() (the global error handler).
 * Eliminates the need for try/catch in every controller.
 *
 * Usage:  router.get('/path', asyncHandler(myController));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
