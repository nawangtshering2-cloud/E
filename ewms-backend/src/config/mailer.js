'use strict';

const nodemailer = require('nodemailer');
const env = require('./env');
const logger = require('./logger');

/**
 * Shared Nodemailer transporter.
 * Uses SMTP credentials from .env.
 * In development, if SMTP_USER is not set, logs emails to console instead of sending.
 */
const transporter = nodemailer.createTransport({
  host:   env.smtp.host,
  port:   env.smtp.port,
  secure: env.smtp.port === 465,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

/**
 * Send an email.
 * @param {Object} options - { to, subject, html }
 */
async function sendMail({ to, subject, html }) {
  // If no SMTP credentials configured, just log (useful during development)
  if (!env.smtp.user || !env.smtp.pass) {
    logger.debug(`[Mailer] (DEV - no SMTP configured) To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from:    env.smtp.from,
      to,
      subject,
      html,
    });
    logger.info(`[Mailer] Email sent to ${to} — MessageId: ${info.messageId}`);
  } catch (err) {
    // Non-fatal: log the error but do not crash the request
    logger.error(`[Mailer] Failed to send email to ${to}: ${err.message}`);
  }
}

module.exports = { sendMail };
