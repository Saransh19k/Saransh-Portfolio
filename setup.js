#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Saransh Portfolio...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Create necessary directories
const directories = [
  'server/uploads',
  'server/database',
  'client/public/images',
  'client/public/images/blog',
  'client/public/images/projects'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `# Environment Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
# For development, SQLite will be used automatically
# For production, set these variables:
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_NAME=saransh_portfolio

# Email Configuration (Optional)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# JWT Secret (generate a random string for production)
JWT_SECRET=your_jwt_secret_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Analytics (Optional)
# GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
# GOOGLE_TAG_MANAGER_ID=GTM_ID
`;

  fs.writeFileSync(envPath, envContent);
  console.log('📄 Created .env file');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('Installing server dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Installing client dependencies...');
  execSync('cd client && npm install', { stdio: 'inherit' });
  
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Initialize database
console.log('\n🗄️ Initializing database...');

try {
  const { seedDatabase } = require('./server/database/seeder');
  seedDatabase()
    .then(() => {
      console.log('✅ Database initialized with sample data');
    })
    .catch((error) => {
      console.error('❌ Error initializing database:', error.message);
      console.log('⚠️ You can manually seed the database later using: node server/database/seeder.js');
    });
} catch (error) {
  console.error('❌ Error loading database seeder:', error.message);
  console.log('⚠️ Database initialization skipped');
}

// Create README instructions
const readmeContent = `# Saransh Portfolio Setup Complete! 🎉

## Quick Start

1. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Access your application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## Database

This project uses SQLite for development and PostgreSQL for production:

- **Development**: SQLite database file at \`server/database/development.sqlite\`
- **Production**: Configure PostgreSQL in your \`.env\` file

## Available Scripts

- \`npm run dev\` - Start development servers
- \`npm run build\` - Build for production
- \`npm start\` - Start production server
- \`npm run test\` - Run tests
- \`npm run lint\` - Run ESLint

## Environment Variables

Copy \`.env.example\` to \`.env\` and configure:

- Database settings
- Email configuration
- JWT secret
- Rate limiting

## Features

✅ React 18 with TypeScript
✅ Node.js with Express
✅ SQLite/PostgreSQL with Sequelize
✅ Tailwind CSS for styling
✅ Framer Motion animations
✅ Three.js 3D effects
✅ Blog system
✅ Contact form
✅ Project showcase
✅ Responsive design
✅ SEO optimized

## Next Steps

1. Customize the content in the components
2. Add your projects to the projects data
3. Configure your email settings
4. Deploy to your preferred hosting platform

Happy coding! 🚀
`;

fs.writeFileSync('SETUP_COMPLETE.md', readmeContent);
console.log('📄 Created SETUP_COMPLETE.md with instructions');

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:3000');
console.log('3. Check: http://localhost:5000/api/health');
console.log('\n📖 See SETUP_COMPLETE.md for detailed instructions'); 