const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import database configuration
const { sequelize, testConnection, syncDatabase } = require('./config/database');

// Import models
const Blog = require('./models/Blog');
const Contact = require('./models/Contact');
const User = require('./models/User');

// Import routes
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/contact');
const projectsRoutes = require('./routes/projects');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');
const recentActivityRoutes = require('./routes/recentActivity');
const aboutRoutes = require('./routes/about');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy for rate limiter
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.github.com"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 10000, // much higher for dev
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

if (process.env.NODE_ENV === 'production') {
  app.use('/api/', limiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://saranshnimje.com']
    : [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://192.168.29.164:3000'
      ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: sequelize.getDialect()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin/recent-activity', recentActivityRoutes);
app.use('/api/about', aboutRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry',
      errors: err.errors.map(e => ({
        field: e.path,
        message: `${e.path} already exists`
      }))
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Initialize database and start server
const initializeServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (dbConnected) {
      // Sync database (create tables if they don't exist)
      await syncDatabase();
      
      // Start server
      app.listen(PORT, '0.0.0.0', () => {
        console.log('🚀 Server running on port', PORT);
        console.log('📊 Environment:', NODE_ENV);
        console.log('🌐 Health check: http://localhost:' + PORT + '/api/health');
        console.log('🔗 API Base URL: http://localhost:' + PORT + '/api');
        console.log('🗄️ Database:', sequelize.getDialect());
      });
    } else {
      console.log('⚠️ Database connection failed, running in development mode without database');
      console.log('📝 To enable full functionality, check your database configuration');
      
      // Start server without database
      app.listen(PORT, '0.0.0.0', () => {
        console.log('🚀 Server running on port', PORT);
        console.log('📊 Environment:', NODE_ENV);
        console.log('🌐 Health check: http://localhost:' + PORT + '/api/health');
        console.log('🔗 API Base URL: http://localhost:' + PORT + '/api');
      });
    }
  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  await sequelize.close();
  process.exit(0);
});

// Start the server
initializeServer(); 