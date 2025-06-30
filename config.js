// Development configuration file
module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database Configuration (using in-memory for development)
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // Email Configuration (disabled for development)
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'dev@example.com',
      pass: process.env.SMTP_PASS || 'dev-password'
    }
  },

  // Frontend Configuration
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000'
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret-key-2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100
  },

  // File Upload
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
    uploadPath: process.env.UPLOAD_PATH || './uploads'
  },

  // Analytics
  analytics: {
    enabled: process.env.ENABLE_ANALYTICS === 'true' || true,
    retentionDays: process.env.ANALYTICS_RETENTION_DAYS || 30
  }
}; 