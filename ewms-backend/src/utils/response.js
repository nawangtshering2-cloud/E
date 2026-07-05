'use strict';

/**
 * Standardized JSON response envelope used by every controller.
 *
 * Success:  { success: true,  data: <payload> }
 * Error:    { success: false, error: <message> }
 */

const sendSuccess = (res, data = null, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

const sendError = (res, message = 'Something went wrong', statusCode = 500) => {
  return res.status(statusCode).json({ success: false, error: message });
};

module.exports = { sendSuccess, sendError };
