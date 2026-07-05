'use strict';

const app           = require('./src/app');
const env           = require('./src/config/env');
const { connectDB } = require('./src/config/db');
const logger        = require('./src/config/logger');

/**
 * EWMS Backend – Entry Point
 * 1. Verify DB connectivity
 * 2. Start the HTTP server
 */
async function start() {
  await connectDB();

  const server = app.listen(env.port, () => {
    logger.info(`[Server] EWMS API running on port ${env.port} (${env.nodeEnv})`);
    logger.info(`[Server] Health check → http://localhost:${env.port}/api/health`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('[Server] SIGTERM received — shutting down gracefully.');
    server.close(() => process.exit(0));
  });
}

start().catch((err) => {
  logger.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
