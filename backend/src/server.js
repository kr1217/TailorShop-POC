require('dotenv').config();
const express = require('express');
const sequelize = require('./utils/db');
const cors = require('cors');
const customerRoutes = require('./routes/customers');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
require('./utils/backup'); // Initializes the cron schedule

const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Env Validation ────────────────────────────────────────────────────────
// ── Env Validation ────────────────────────────────────────────────────────
if (!process.env.MYSQL_HOST) {
  console.warn('WARNING: MYSQL_HOST is not defined, defaulting to localhost.');
}

// ── Security Middleware ───────────────────────────────────────────────────
app.use(helmet());

// CORS: restrict to frontend URL in production
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── Logging & Performance ─────────────────────────────────────────────────
// Use 'combined' format in production for structured, Apache-compatible logs
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(compression());
app.use(express.json());

// ── Rate Limiting ─────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/customers', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', dashboardRoutes);

// ── Health Check (for Docker health checks) ───────────────────────────────
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

// ── MySQL Connection ──────────────────────────────────────────────────────
sequelize.authenticate()
  .then(() => {
    console.log('Connected to MySQL');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synced');
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });

    // ── Graceful Shutdown ─────────────────────────────────────────────────
    const shutdown = (signal) => {
      console.log(`\nReceived ${signal}. Closing HTTP server gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        sequelize.close().then(() => {
          console.log('MySQL connection closed.');
          process.exit(0);
        });
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
    process.exit(1);
  });
