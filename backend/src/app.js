const express = require('express');
const cors = require('cors');
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// CORS configuration using FRONTEND_URL
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    // Allow configured frontendUrl and localhost variations
    if (origin === frontendUrl || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    // Permissive in prototype development
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'dhaniti-backend-api'
  });
});

// Mount Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Handler for unhandled /api routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.url.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: `Cannot ${req.method} ${req.url}`
    });
  }
  next();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
