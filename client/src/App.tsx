import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsTracker from './components/AnalyticsTracker';

// Pages
import Introduce from './pages/Introduce';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// Context
import { useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();

  // Determine which components to show based on current route
  const isAuthPage = ['/login', '/signup', '/admin/login'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');
  const isIntroducePage = location.pathname === '/';
  const showNavbar = !isAuthPage && !isAdminPage;
  const showFooter = !isAuthPage && !isAdminPage && !isIntroducePage;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : 'light'}`}>
      <AnalyticsTracker />
      <ParticleBackground />
      
      {showNavbar && <Navbar />}
      
      <main className={`relative z-10 ${isAuthPage || isAdminPage ? '' : 'pt-16'}`}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Pages */}
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Introduce />
                </motion.div>
              } 
            />
            
            {/* User Authentication Pages */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Login />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Signup />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Authentication */}
            <Route 
              path="/admin/login" 
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AdminLogin />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Dashboard - Protected */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireDeveloper={true}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AdminDashboard />
                  </motion.div>
                </ProtectedRoute>
              } 
            />
            
            {/* Main Portfolio Pages */}
            <Route 
              path="/home" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Home />
                </motion.div>
              } 
            />
            <Route 
              path="/about" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <About />
                </motion.div>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Projects />
                </motion.div>
              } 
            />
            <Route 
              path="/blog" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Blog />
                </motion.div>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Contact />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 