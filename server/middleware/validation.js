// Validation middleware for API endpoints

// Contact form validation
const validateContact = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  
  // Check required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  
  // Validate field lengths
  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Name must be between 2 and 50 characters'
    });
  }
  
  if (subject.length < 5 || subject.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Subject must be between 5 and 100 characters'
    });
  }
  
  if (message.length < 10 || message.length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Message must be between 10 and 1000 characters'
    });
  }
  
  // Sanitize inputs
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.subject = subject.trim();
  req.body.message = message.trim();
  
  next();
};

// User registration validation
const validateUserRegistration = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  
  // Check required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  
  // Validate field lengths
  if (firstName.length < 2 || firstName.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'First name must be between 2 and 50 characters'
    });
  }
  
  if (lastName.length < 2 || lastName.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Last name must be between 2 and 50 characters'
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }
  
  // Validate password strength (optional)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    });
  }
  
  // Sanitize inputs
  req.body.firstName = firstName.trim();
  req.body.lastName = lastName.trim();
  req.body.email = email.trim().toLowerCase();
  
  next();
};

// User login validation
const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  
  // Sanitize inputs
  req.body.email = email.trim().toLowerCase();
  
  next();
};

// Admin login validation
const validateAdminLogin = (req, res, next) => {
  const { email, password, adminKey } = req.body;
  
  // Check required fields
  if (!email || !password || !adminKey) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and admin key are required'
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  
  // Validate password length
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }
  
  // Validate admin key
  if (adminKey.length < 1) {
    return res.status(400).json({
      success: false,
      message: 'Admin key is required'
    });
  }
  
  // Sanitize inputs
  req.body.email = email.trim().toLowerCase();
  
  next();
};

// Blog post validation
const validateBlogPost = (req, res, next) => {
  const { title, content, excerpt, tags } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title and content are required'
    });
  }
  
  if (title.length < 5 || title.length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Title must be between 5 and 200 characters'
    });
  }
  
  if (content.length < 50) {
    return res.status(400).json({
      success: false,
      message: 'Content must be at least 50 characters'
    });
  }
  
  // Sanitize inputs
  req.body.title = title.trim();
  req.body.content = content.trim();
  req.body.excerpt = excerpt ? excerpt.trim() : '';
  req.body.tags = tags ? tags.filter(tag => tag.trim().length > 0) : [];
  
  next();
};

// Project validation
const validateProject = (req, res, next) => {
  const { title, description, technologies, githubUrl, liveUrl } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required'
    });
  }
  
  if (title.length < 3 || title.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Title must be between 3 and 100 characters'
    });
  }
  
  if (description.length < 20) {
    return res.status(400).json({
      success: false,
      message: 'Description must be at least 20 characters'
    });
  }
  
  // Validate URLs if provided
  if (githubUrl && !isValidUrl(githubUrl)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid GitHub URL'
    });
  }
  
  if (liveUrl && !isValidUrl(liveUrl)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid live URL'
    });
  }
  
  // Sanitize inputs
  req.body.title = title.trim();
  req.body.description = description.trim();
  req.body.technologies = technologies ? technologies.filter(tech => tech.trim().length > 0) : [];
  req.body.githubUrl = githubUrl ? githubUrl.trim() : '';
  req.body.liveUrl = liveUrl ? liveUrl.trim() : '';
  
  next();
};

// Analytics validation
const validateAnalytics = (req, res, next) => {
  const { page, referrer, userAgent } = req.body;
  
  if (!page) {
    return res.status(400).json({
      success: false,
      message: 'Page information is required'
    });
  }
  
  // Sanitize inputs
  req.body.page = page.trim();
  req.body.referrer = referrer ? referrer.trim() : '';
  req.body.userAgent = userAgent ? userAgent.trim() : '';
  
  next();
};

// URL validation helper
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

module.exports = {
  validateContact,
  validateUserRegistration,
  validateUserLogin,
  validateAdminLogin,
  validateBlogPost,
  validateProject,
  validateAnalytics
}; 