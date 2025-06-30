import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Introduce: React.FC = () => {
  const [currentText, setCurrentText] = useState(0);
  const { isDeveloper } = useAuth();
  const texts = [
    "Welcome to My Portfolio",
    "Discover My Work",
    "Explore My Skills",
    "Connect With Me"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-20 bg-pattern"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="gradient-text">Saransh Nimje</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 font-light">
              Full Stack Developer & AI Enthusiast
            </p>
          </motion.div>

          {/* Animated Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-16 mb-8"
          >
            <motion.span
              key={currentText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-2xl text-indigo-400 font-medium"
            >
              {texts[currentText]}
            </motion.span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            I'm a passionate developer who loves creating innovative digital experiences. 
            From frontend to backend, I build scalable solutions that make a real impact. 
            Let's explore my journey together.
          </motion.p>

          {/* Main CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link to="/home">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary text-xl px-10 py-5"
              >
                <i className="fas fa-home mr-3"></i>
                Enter Portfolio
              </motion.button>
            </Link>
            
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline text-xl px-10 py-5"
              >
                <i className="fas fa-sign-in-alt mr-3"></i>
                Login
              </motion.button>
            </Link>
          </motion.div>

          {/* Admin Access - Only show for developers */}
          {isDeveloper && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mb-16"
            >
              <Link to="/admin/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn bg-gradient-to-r from-red-600 to-orange-600 text-white text-xl px-10 py-5 hover:from-red-700 hover:to-orange-700"
                >
                  <i className="fas fa-user-shield mr-3"></i>
                  Admin Panel
                </motion.button>
              </Link>
            </motion.div>
          )}

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: "fas fa-user", label: "About", path: "/about" },
              { icon: "fas fa-code", label: "Projects", path: "/projects" },
              { icon: "fas fa-blog", label: "Blog", path: "/blog" },
              { icon: "fas fa-envelope", label: "Contact", path: "/contact" }
            ].map((link, index) => (
              <Link key={link.label} to={link.path}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-indigo-500 transition-all duration-300"
                >
                  <i className={`${link.icon} text-3xl text-indigo-400 mb-3`}></i>
                  <p className="text-gray-300 font-medium">{link.label}</p>
                </motion.div>
              </Link>
            ))}
          </motion.div>

          {/* Sign Up Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 p-6 rounded-xl bg-indigo-900/20 backdrop-blur-sm border border-indigo-500/30 max-w-md mx-auto"
          >
            <p className="text-gray-300 mb-4">New here? Create an account to get updates!</p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary px-6 py-3"
              >
                <i className="fas fa-user-plus mr-2"></i>
                Sign Up
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
      />
    </div>
  );
};

export default Introduce; 