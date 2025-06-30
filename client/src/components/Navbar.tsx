import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isDeveloper, logout } = useAuth();
  const location = useLocation();

  // Hide navbar on auth pages
  const isAuthPage = ['/login', '/signup', '/admin/login'].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');
  const isIntroducePage = location.pathname === '/';

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const authItems = [
    { name: 'Login', path: '/login' },
    { name: 'Sign Up', path: '/signup' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  // Don't render navbar on auth pages or admin pages
  if (isAuthPage || isAdminPage) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-md border-b border-gray-800' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-xl">S</span>
            </motion.div>
            <span className="text-xl font-bold gradient-text">Saransh Nimje</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-indigo-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side - Auth Links, Admin Access & Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Admin Access Link - Only show on main pages, not on introduce page */}
            {!isIntroducePage && isDeveloper && (
              <Link
                to="/admin/dashboard"
                className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors border border-red-500/30 hover:border-red-500/50 rounded-lg"
              >
                <i className="fas fa-user-shield mr-2"></i>
                Admin Panel
              </Link>
            )}

            {/* Auth Links - Only show on main pages, not on introduce page */}
            {!isIntroducePage && !isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                {authItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      item.name === 'Sign Up'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* User Menu - Show when authenticated */}
            {!isIntroducePage && isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm">{user?.name || user?.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </div>
            )}

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <i className="fas fa-sun text-yellow-400"></i>
              ) : (
                <i className="fas fa-moon text-gray-400"></i>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                    isOpen ? 'rotate-45 translate-y-1' : ''
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${
                    isOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-white transition-all duration-300 mt-1 ${
                    isOpen ? '-rotate-45 -translate-y-1' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Main Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMenu}
                  className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Divider */}
              {!isIntroducePage && (
                <>
                  <div className="border-t border-gray-700 my-4"></div>
                  
                  {/* Admin Access */}
                  {isDeveloper && (
                    <Link
                      to="/admin/dashboard"
                      onClick={closeMenu}
                      className="block px-3 py-2 text-base font-medium text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <i className="fas fa-user-shield mr-2"></i>
                      Admin Panel
                    </Link>
                  )}
                  
                  {/* Auth Items */}
                  {!isAuthenticated ? (
                    authItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={closeMenu}
                        className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200 ${
                          item.name === 'Sign Up'
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))
                  ) : (
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-base font-medium text-gray-300">
                        <i className="fas fa-user mr-2"></i>
                        {user?.name || user?.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar; 