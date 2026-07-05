'use strict';

const router = require('express').Router();
const { pool } = require('../config/db');

/**
 * GET /api/health
 * Used by hosting platforms (Render, Railway) and uptime monitors.
 * Returns server status + DB connectivity check.
 */
router.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      data: {
        status:    'ok',
        database:  'connected',
        timestamp: new Date().toISOString(),
        uptime:    `${Math.floor(process.uptime())}s`,
      },
    });
  } catch (_err) {
    res.status(503).json({
      success: false,
      data: { status: 'degraded', database: 'unreachable' },
    });
  }
});

module.exports = router;
