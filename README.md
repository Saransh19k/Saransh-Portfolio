# 🚀 Saransh's Portfolio - Full Stack Developer v1.0

A modern, feature-rich portfolio showcasing full-stack development skills with cutting-edge technologies, interactive elements, and professional design. **Featuring a comprehensive dual-system architecture with separate developer admin panel and user-facing website.**

![Portfolio Preview](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Sequelize](https://img.shields.io/badge/Sequelize-6.35.2-blue)
![Dual-System](https://img.shields.io/badge/Architecture-Dual--System-orange)

## ✨ Features

### 🎨 Frontend Features
- **Modern React with TypeScript** - Type-safe development with latest React 18.2.0
- **Dual-System Architecture** - Separate developer admin panel and user interface
- **Beautiful Animations** - Framer Motion 10.16.0 powered transitions and effects
- **3D Interactive Elements** - Three.js 0.158.0 integration with particle backgrounds
- **Dark/Light Theme** - Dynamic theme switching with Context API and persistence
- **Responsive Design** - Mobile-first approach with Tailwind CSS 3.3.3
- **Smart Navigation** - Conditional navbar rendering based on authentication status
- **Authentication System** - User and developer login with role-based access control
- **Real-time Typing** - Animated text effects throughout the site
- **Professional UI/UX** - Clean, modern design with accessibility features
- **Form Validation** - React Hook Form 7.47.0 with comprehensive validation
- **Toast Notifications** - User feedback with React Hot Toast 2.4.1
- **Markdown Support** - Blog posts with syntax highlighting
- **Image Optimization** - Sharp integration for optimized images
- **Protected Routes** - Role-based access control for admin and user pages

### 🔧 Backend Features
- **Node.js/Express API** - RESTful backend with comprehensive endpoints
- **Sequelize Database** - SQL data storage with Sequelize 6.35.2 ORM
- **Contact Form System** - Email notifications with spam protection
- **Blog Management** - Content management system with markdown support
- **File Upload** - Image/document handling with Multer 1.4.5-lts.1 and Sharp 0.33.0
- **Analytics Tracking** - Visitor tracking and portfolio insights
- **Security Features** - Rate limiting, CORS, Helmet, input validation
- **JWT Authentication** - Secure API access control with bcryptjs 2.4.3
- **Comprehensive Logging** - Morgan logger for monitoring
- **Error Handling** - Robust error management and reporting

### 🎯 Unique Features
- **Interactive Particle Background** - Dynamic CSS-based particle system
- **Live Project Demos** - Embedded project showcases with 3D elements
- **Skills Visualization** - Interactive skill charts and progress bars
- **Timeline Animations** - Animated experience and project timeline
- **Real-time Analytics** - Live visitor statistics and insights
- **Portfolio Analytics** - Detailed performance metrics
- **Drag & Drop Uploads** - Modern file upload experience with React Dropzone
- **Intersection Observer** - Scroll-based animations
- **Service Worker Ready** - PWA capabilities for offline access
- **Authentication Flow** - Seamless login/signup experience with social options
- **Smart Route Management** - Conditional component rendering for optimal UX
- **Role-Based Access Control** - Developer and user role management
- **Admin Dashboard** - Comprehensive content management system

## 🏗️ Dual-System Architecture

### 👨‍💻 Developer System (Admin Panel)
- **Secure Access** - Developer-only authentication with admin key verification
- **Content Management** - Full CRUD operations for projects, blog posts, and settings
- **Analytics Dashboard** - Real-time website statistics and visitor insights
- **User Management** - View and manage user accounts and interactions
- **System Settings** - Configure website appearance, SEO, and functionality
- **Activity Monitoring** - Track recent changes and system activities

### 👥 User System (Public Website)
- **Public Access** - Open access to portfolio content and information
- **User Authentication** - Optional login for personalized experience
- **Content Viewing** - Browse projects, blog posts, and portfolio information
- **Contact System** - Submit inquiries and feedback
- **Responsive Design** - Optimized for all devices and screen sizes

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** + TypeScript 5.1.6
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **Framer Motion 10.16.0** - Animation library
- **Three.js 0.158.0** - 3D graphics library
- **React Router 6.15.0** - Client-side routing
- **Axios 1.10.0** - HTTP client
- **React Query 3.39.3** - Server state management
- **React Hook Form 7.47.0** - Form handling
- **Lucide React 0.292.0** - Modern icons
- **React Hot Toast 2.4.1** - Toast notifications
- **React Markdown 9.0.0** - Markdown rendering
- **React Dropzone 14.2.3** - File upload handling
- **Context API** - State management

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js 4.18.2** - Web framework
- **Sequelize 6.35.2** - Database ORM
- **SQLite3 5.1.6** - Development database
- **PostgreSQL 8.11.3** - Production database
- **Nodemailer 6.9.7** - Email functionality
- **Multer 1.4.5-lts.1** - File upload handling
- **Sharp 0.33.0** - Image processing
- **Helmet 7.1.0** - Security headers
- **CORS 2.8.5** - Cross-origin resource sharing
- **Express Rate Limit 7.1.5** - API rate limiting
- **Morgan 1.10.0** - Logging
- **Joi 17.11.0** - Input validation
- **bcryptjs 2.4.3** - Password hashing
- **JWT 9.0.2** - Authentication tokens

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- SQLite (development) / PostgreSQL (production)

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Saransh Portfolio"
```

### 2. Install dependencies
```bash
# Install all dependencies (root + client)
npm run install:all

# Or install individually:
npm install
cd client && npm install
cd ..
```

### 3. Set up environment variables
```bash
# Copy configuration template
cp config.example.js config.js

# Edit config.js with your settings:
# - Database connection string
# - Email service credentials
# - JWT secret
# - Other environment variables
```

### 4. Start development servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:client  # Frontend only (port 3000)
npm run dev:server  # Backend only (port 5000)
```

### 5. Open your browser
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health
- **Admin Panel**: http://localhost:3000/admin/login

### 6. Admin Access
- **Developer Key**: `developer2024` (demo purposes)
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## 📁 Project Structure

```
Saransh Portfolio/
├── client/                    # React Frontend
│   ├── package.json          # Frontend dependencies
│   │   ├── public/
│   │   │   ├── index.html        # Main HTML file
│   │   │   └── manifest.json     # PWA manifest
│   │   └── src/
│   │       ├── App.tsx           # Main app component with routing
│   │       ├── index.tsx         # Entry point
│   │       ├── index.css         # Global styles
│   │       ├── components/       # Reusable components
│   │       │   ├── Navbar.tsx    # Smart navigation component
│   │       │   ├── Footer.tsx    # Footer component
│   │       │   ├── ParticleBackground.tsx  # Animated background
│   │       │   ├── ThreeScene.tsx # 3D scene component
│   │       │   └── ProtectedRoute.tsx # Route protection
│   │       ├── pages/            # Page components
│   │       │   ├── Introduce.tsx # Landing/intro page
│   │       │   ├── Home.tsx      # Main portfolio page
│   │       │   ├── About.tsx     # About page
│   │       │   ├── Projects.tsx  # Projects showcase
│   │       │   ├── Blog.tsx      # Blog page
│   │       │   ├── Contact.tsx   # Contact form
│   │       │   ├── Login.tsx     # User authentication login
│   │       │   ├── Signup.tsx    # User authentication signup
│   │       │   ├── AdminLogin.tsx # Developer admin login
│   │       │   └── AdminDashboard.tsx # Developer admin panel
│   │       ├── context/          # Context providers
│   │       │   ├── AuthContext.tsx  # Authentication management
│   │       │   └── ThemeContext.tsx # Theme management
│   │       └── utils/
│   │           └── api.ts        # API client
│   ├── server/                   # Node.js Backend
│   │   ├── index.js             # Server entry point
│   │   ├── models/              # Sequelize models
│   │   │   ├── Blog.js          # Blog post schema
│   │   │   ├── Contact.js       # Contact form schema
│   │   │   ├── User.js          # User authentication schema
│   │   │   └── Analytics.js     # Analytics schema
│   │   ├── routes/              # API routes
│   │   │   ├── analytics.js     # Analytics endpoints
│   │   │   ├── auth.js          # Authentication endpoints
│   │   │   ├── blog.js          # Blog endpoints
│   │   │   ├── contact.js       # Contact endpoints
│   │   │   └── projects.js      # Projects endpoints
│   │   ├── middleware/          # Custom middleware
│   │   │   ├── auth.js          # Authentication
│   │   │   ├── validation.js    # Input validation
│   │   │   └── upload.js        # File upload
│   │   ├── utils/               # Utility functions
│   │   │   ├── email.js         # Email utility
│   │   │   └── logger.js        # Logging utility
│   │   └── config/              # Configuration
│   │       └── database.js      # Sequelize connection
│   ├── database/                # Database files
│   │   ├── development.db       # SQLite development database
│   │   └── seeder.js           # Database seeder
│   ├── package.json             # Root dependencies
│   ├── package-lock.json        # Lock file
│   ├── README.md               # Project documentation
│   ├── PORTFOLIO_SUMMARY.md    # Detailed project summary
│   ├── DUAL_SYSTEM_SUMMARY.md  # Dual-system architecture details
│   ├── config.example.js       # Configuration template
│   ├── config.js              # Active configuration
│   └── setup.js               # Setup script
```

## 🔐 Authentication System

### User Authentication
- **Registration**: Comprehensive signup form with validation
- **Login**: Secure login with remember me functionality
- **Session Management**: JWT tokens with localStorage persistence
- **Protected Routes**: Role-based access control

### Developer Authentication
- **Admin Login**: Secure developer access with admin key
- **Admin Dashboard**: Comprehensive content management system
- **Role Management**: Developer-only privileges and access

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Tailwind CSS**: Utility-first styling approach
- **Custom Components**: Reusable and maintainable components
- **Accessibility**: Keyboard navigation and screen reader support

### Animations & Interactions
- **Framer Motion**: Smooth page transitions and micro-interactions
- **Three.js**: 3D interactive elements and particle effects
- **Scroll Animations**: Intersection Observer for scroll-based effects
- **Loading States**: Spinner animations and loading indicators

### Theme System
- **Dark/Light Mode**: Dynamic theme switching
- **Context API**: Centralized theme management
- **Persistence**: Theme preference saved in localStorage
- **Smooth Transitions**: Animated theme changes

## 🔧 Development Features

### Code Quality
- **TypeScript**: Type-safe development
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit code quality checks

### Development Tools
- **Hot Reloading**: Fast development with live reload
- **Debugging**: Comprehensive error handling and logging
- **Testing**: Jest setup for unit and integration tests
- **Build Optimization**: Production-ready build configuration

## 📊 Available Scripts

### Root Level
```bash
npm run dev              # Start both frontend and backend
npm run dev:client       # Start frontend only
npm run dev:server       # Start backend only
npm run build           # Build frontend for production
npm run install:all     # Install all dependencies
npm run setup           # Run setup script
npm run test            # Run tests
npm run lint            # Lint code
npm run lint:fix        # Fix linting issues
```

### Client Level
```bash
cd client
npm start               # Start development server
npm run build           # Build for production
npm run test            # Run tests
npm run test:coverage   # Run tests with coverage
npm run lint            # Lint TypeScript files
npm run type-check      # TypeScript type checking
npm run preview         # Preview production build
```

## 🌟 Key Features Implemented

### ✅ Frontend
- [x] Dual-system architecture with role-based access
- [x] User and developer authentication
- [x] Protected routes and admin panel
- [x] Responsive design with Tailwind CSS
- [x] Dark/light theme system
- [x] 3D interactive elements with Three.js
- [x] Smooth animations with Framer Motion
- [x] Form validation with React Hook Form
- [x] Markdown support for blog content
- [x] Toast notifications
- [x] File upload with drag & drop
- [x] Smart navigation with conditional rendering

### ✅ Backend
- [x] RESTful API with Express.js
- [x] Sequelize ORM with multiple database support
- [x] JWT authentication with bcryptjs
- [x] Email functionality with Nodemailer
- [x] File upload with Multer and Sharp
- [x] Security middleware (Helmet, CORS, Rate Limiting)
- [x] Input validation with Joi
- [x] Comprehensive error handling
- [x] Analytics tracking system
- [x] Database models and migrations

### ✅ DevOps & Quality
- [x] TypeScript configuration
- [x] ESLint and Prettier setup
- [x] Jest testing framework
- [x] Development and production scripts
- [x] Comprehensive documentation
- [x] Git workflow and version control

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Environment Variables
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - JWT signing secret
- `EMAIL_HOST` - SMTP host for email
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password
- `NODE_ENV` - Environment (development/production)

## 📚 Documentation

- **[PORTFOLIO_SUMMARY.md](./PORTFOLIO_SUMMARY.md)** - Detailed project summary
- **[DUAL_SYSTEM_SUMMARY.md](./DUAL_SYSTEM_SUMMARY.md)** - Dual-system architecture details
- **[API Documentation](./server/routes/)** - Backend API endpoints
- **[Component Documentation](./client/src/components/)** - Frontend components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Saransh Nimje**
- GitHub: [@saranshnimje](https://github.com/saranshnimje)
- Portfolio: [saranshnimje.com](https://saranshnimje.com)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- Three.js for 3D graphics capabilities
- Express.js for the robust backend framework
- Sequelize for the excellent ORM

---

⭐ **Star this repository if you found it helpful!** 