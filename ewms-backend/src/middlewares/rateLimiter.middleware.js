'use strict';

const rateLimit = require('express-rate-limit');

/**
 * authLimiter — strict limit for login / register / password reset routes.
 * Mitigates brute-force attacks.
 * 10 requests per IP per 15 minutes.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

/**
 * contactLimiter — light limit for the public contact form.
 * 5 submissions per IP per hour.
 */
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many messages submitted. Please try again later.',
  },
});

/**
 * generalLimiter — broad safety net for all other routes.
 * 200 requests per IP per 15 minutes.
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please slow down.',
  },
});

module.exports = { authLimiter, contactLimiter, generalLimiter };
