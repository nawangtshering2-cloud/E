'use strict';

require('dotenv').config();

/**
 * Central environment configuration.
 * All process.env reads happen HERE — nowhere else in the codebase.
 * If a required variable is missing we fail fast on startup.
 */

const required = [
  'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
  'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET',
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[Config] Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host:     process.env.DB_HOST,
    port:     parseInt(process.env.DB_PORT, 10) || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  jwt: {
    accessSecret:     process.env.JWT_ACCESS_SECRET,
    refreshSecret:    process.env.JWT_REFRESH_SECRET,
    accessExpiresIn:  process.env.JWT_ACCESS_EXPIRES_IN  || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || 'EWMS <no-reply@ewms.in>',
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  admin: {
    name:     process.env.ADMIN_NAME     || 'Super Admin',
    email:    process.env.ADMIN_EMAIL    || 'admin@ewms.in',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
  },
};
