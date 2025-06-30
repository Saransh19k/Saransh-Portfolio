import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // User registration
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // User login
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Admin login
  adminLogin: async (credentials: {
    email: string;
    password: string;
    adminKey: string;
  }) => {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    website?: string;
    location?: string;
    preferences?: any;
  }) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get all users (admin only)
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    isActive?: boolean;
  }) => {
    const response = await api.get('/auth/users', { params });
    return response.data;
  },
};

// Contact API functions
export const contactAPI = {
  submit: async (contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await api.get('/contact', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  markAsRead: async (id: number) => {
    const response = await api.patch(`/contact/${id}/read`);
    return response.data;
  },

  reply: async (id: number, replyMessage: string) => {
    const response = await api.post(`/contact/${id}/reply`, { replyMessage });
    return response.data;
  },
};

// Blog API functions
export const blogAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    tag?: string;
  }) => {
    const response = await api.get('/blog', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  },

  create: async (blogData: {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string[];
  }) => {
    const response = await api.post('/blog', blogData);
    return response.data;
  },

  update: async (id: number, blogData: {
    title?: string;
    content?: string;
    excerpt?: string;
    tags?: string[];
    status?: string;
  }) => {
    const response = await api.put(`/blog/${id}`, blogData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  },
};

// Project API functions
export const projectAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    search?: string;
    sort?: string;
  }) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (projectData: {
    title: string;
    description: string;
    image: string;
    technologies: string[];
    category: string;
    liveUrl?: string;
    githubUrl?: string;
    featured?: boolean;
  }) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  update: async (id: number, projectData: {
    title?: string;
    description?: string;
    image?: string;
    technologies?: string[];
    category?: string;
    liveUrl?: string;
    githubUrl?: string;
    featured?: boolean;
    views?: number;
    likes?: number;
  }) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  like: async (id: number) => {
    const response = await api.post(`/projects/${id}/like`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/projects/categories/list');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/projects/stats/overview');
    return response.data;
  },
};

// Analytics API functions
export const analyticsAPI = {
  trackPageView: async (pageData: {
    page: string;
    referrer?: string;
    userAgent?: string;
  }) => {
    const response = await api.post('/analytics/pageview', pageData);
    return response.data;
  },

  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
    groupBy?: string;
  }) => {
    const response = await api.get('/analytics/stats', { params });
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api; 