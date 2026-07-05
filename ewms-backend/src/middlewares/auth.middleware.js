'use strict';

const { verifyAccessToken } = require('../utils/tokenUtils');
const { sendError } = require('../utils/response');

/**
 * authenticate — verifies the Bearer JWT in the Authorization header.
 * On success, attaches `req.user = { id, role }` and calls next().
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'No token provided. Please log in.', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please refresh your token.', 401);
    }
    return sendError(res, 'Invalid token. Please log in again.', 401);
  }
}

/**
 * authorize(...roles) — RBAC middleware factory.
 * Call AFTER authenticate.
 *
 * Example:  router.delete('/users/:id', authenticate, authorize('admin'), handler)
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return sendError(res, 'You do not have permission to perform this action.', 403);
    }
    next();
  };
}

module.exports = { authenticate, authorize };
