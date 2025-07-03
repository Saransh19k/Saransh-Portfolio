import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contactAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Contact: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [userMessages, setUserMessages] = useState<any[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/saranshnimje',
      icon: 'fab fa-github',
      color: 'hover:text-gray-400'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/saranshnimje',
      icon: 'fab fa-linkedin',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/saranshnimje',
      icon: 'fab fa-twitter',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Email',
      url: 'mailto:saranshnimje19@gmail.com',
      icon: 'fas fa-envelope',
      color: 'hover:text-red-400'
    }
  ];

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setFormData(f => ({ ...f, email: user.email }));
      setLookupLoading(true);
      setLookupError('');
      contactAPI.getByEmail(user.email)
        .then(res => {
          setUserMessages(res.data.contacts);
          if (res.data.contacts.length === 0) {
            setLookupError('No messages found.');
          }
        })
        .catch(() => setLookupError('Failed to fetch messages.'))
        .finally(() => setLookupLoading(false));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contactAPI.submit({
        name: formData.name,
        email: user?.email || '',
        subject: formData.subject,
        message: formData.message
      });
      setSuccess(true);
      setFormData({ name: '', email: user?.email || '', subject: '', message: '' });
      if (user?.email) {
        setLookupLoading(true);
        contactAPI.getByEmail(user.email)
          .then(res => setUserMessages(res.data.contacts))
          .finally(() => setLookupLoading(false));
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Please log in to contact us or view your messages.</h2>
        <a href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-medium">Go to Login</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have a project in mind? Let's discuss how we can work together to bring 
            your ideas to life. I'm always excited to hear about new opportunities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6">Send a Message</h2>
            
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-600 text-white p-4 rounded-lg mb-6"
              >
                <i className="fas fa-check-circle mr-2"></i>
                Thank you for your message! I'll get back to you soon.
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-600 text-white p-4 rounded-lg mb-6"
              >
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user?.email || ''}
                    disabled
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors duration-200 opacity-60 cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors duration-200 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="spinner w-5 h-5 mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6">Let's Connect</h2>
            
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Email</h3>
                    <p className="text-gray-400">saranshnimje19@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-map-marker-alt text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Location</h3>
                    <p className="text-gray-400">India</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-clock text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Availability</h3>
                    <p className="text-gray-400">Available for new projects</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-white font-medium mb-4">Follow Me</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 transition-colors duration-200 ${social.color}`}
                      aria-label={social.name}
                    >
                      <i className={`${social.icon} text-xl`}></i>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Quick Response */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-white font-medium mb-2">Quick Response</h3>
                <p className="text-gray-400 text-sm">
                  I typically respond to messages within 24 hours. For urgent matters, 
                  feel free to reach out through any of my social channels.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* User Message Lookup Section */}
        <div className="max-w-2xl mx-auto mt-16 bg-gray-900 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Your Messages & Replies</h2>
          {lookupLoading && <div className="text-gray-300 mb-4">Loading...</div>}
          {lookupError && <div className="text-red-500 mb-4">{lookupError}</div>}
          {userMessages.length > 0 && (
            <div className="space-y-6">
              {userMessages.map((msg, idx) => (
                <div key={msg.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="mb-2">
                    <span className="font-semibold text-white">Subject:</span> <span className="text-gray-300">{msg.subject}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-white">Message:</span> <span className="text-gray-300">{msg.message}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-white">Status:</span> <span className="text-gray-400">{msg.status}</span>
                  </div>
                  {msg.replyMessage && (
                    <div className="mt-2 p-3 bg-green-900 rounded">
                      <span className="font-semibold text-green-400">Admin Reply:</span>
                      <div className="text-green-200 mt-1">{msg.replyMessage}</div>
                    </div>
                  )}
                  {!msg.replyMessage && (
                    <div className="mt-2 text-yellow-400">No reply yet.</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact; 