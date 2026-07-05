'use strict';

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const cookieParser = require('cookie-parser');

const env             = require('./config/env');
const logger          = require('./config/logger');
const errorMiddleware = require('./middlewares/error.middleware');
const { generalLimiter } = require('./middlewares/rateLimiter.middleware');

// ── Route imports (added progressively through Phase 2 steps) ──────────────
const healthRouter  = require('./routes/health.routes');
const authRouter    = require('./routes/auth.routes');
const userRouter    = require('./routes/user.routes');
const recyclerRouter = require('./routes/recycler.routes');
const pickupRouter  = require('./routes/pickup.routes');
const notifRouter   = require('./routes/notification.routes');
const blogRouter    = require('./routes/blog.routes');
const contactRouter = require('./routes/contact.routes');
const adminRouter   = require('./routes/admin.routes');

const app = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin:      env.clientUrl,
  credentials: true,              // allow cookies (refresh token)
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsing & cookies ───────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── HTTP request logging (Morgan → Winston) ──────────────────────────────────
app.use(morgan('combined', {
  stream: { write: (msg) => logger.info(msg.trim()) },
}));

// ── Global rate limiter ──────────────────────────────────────────────────────
app.use(generalLimiter);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api',          healthRouter);
app.use('/api/v1/auth',  authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/recyclers', recyclerRouter);
app.use('/api/v1/pickups',   pickupRouter);
app.use('/api/v1/notifications', notifRouter);
app.use('/api/v1/blogs',   blogRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/admin',   adminRouter);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
