'use strict';

const mysql = require('mysql2/promise');
const env = require('./env');
const logger = require('./logger');

/**
 * Shared MySQL connection pool.
 * Import `pool` anywhere in the app and call pool.query() or pool.execute().
 * All queries use parameterized placeholders (?) — never string concatenation.
 */
const pool = mysql.createPool({
  host:               env.db.host,
  port:               env.db.port,
  user:               env.db.user,
  password:           env.db.password,
  database:           env.db.database,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           'Z',            // store all datetimes as UTC
  decimalNumbers:     true,
});

/**
 * Verify the database connection on startup.
 * Called once from server.js — app won't start if the DB is unreachable.
 */
async function connectDB() {
  try {
    const conn = await pool.getConnection();
    logger.info('[DB] MySQL connection pool established.');
    conn.release();
  } catch (err) {
    logger.error('[DB] Failed to connect to MySQL:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, connectDB };
