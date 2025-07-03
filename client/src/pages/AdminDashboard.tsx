import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI, authAPI, aboutAPI } from '../utils/api';
import { formatDistanceToNow } from 'date-fns';

interface AdminStats {
  totalVisitors: number;
  totalProjects: number;
  totalBlogPosts: number;
  totalContacts: number;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  ipAddress?: string;
  userAgent?: string;
  repliedAt?: string;
  replyMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactStats {
  new: number;
  read: number;
  replied: number;
  archived: number;
}

interface ContactPagination {
  currentPage: number;
  totalPages: number;
  totalContacts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Blog interfaces
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  tags: string[];
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  status: 'draft' | 'published' | 'archived';
}

interface BlogPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Analytics interfaces
interface AnalyticsOverview {
  totalVisitors: number;
  totalPageViews: number;
  uniqueVisitors: number;
  averagePageViewsPerVisitor: number;
}

interface PageStats {
  page: string;
  views: number;
  percentage: string;
}

interface ReferrerStats {
  referrer: string;
  count: number;
  percentage: string;
}

interface TrafficPattern {
  time: string;
  count: number;
}

interface DeviceStats {
  browsers: Array<{ browser: string; count: number }>;
  screenResolutions: Array<{ resolution: string; count: number }>;
  timezones: Array<{ timezone: string; count: number }>;
}

// Project interfaces
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  views: number;
  likes: number;
  completedAt: string;
}

interface ProjectStats {
  totalProjects: number;
  featuredProjects: number;
  totalViews: number;
  totalLikes: number;
  averageViews: number;
  averageLikes: number;
  categoryStats: Record<string, number>;
  topTechnologies: Array<{ tech: string; count: number }>;
}

interface ProjectPagination {
  currentPage: number;
  totalPages: number;
  totalProjects: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  
  // Contact management state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactStats, setContactStats] = useState<ContactStats | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [pagination, setPagination] = useState<ContactPagination>({
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
    hasNext: false,
    hasPrev: false
  });
  const [contactFilters, setContactFilters] = useState({
    status: 'all',
    page: 1,
    limit: 10
  });

  // Blog management state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogPagination, setBlogPagination] = useState<BlogPagination>({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [blogFilters, setBlogFilters] = useState({
    status: 'all',
    category: 'all',
    page: 1,
    limit: 10
  });
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    tags: [] as string[],
    category: 'General',
    authorName: 'Saransh Nimje',
    authorAvatar: '',
    readTime: 5,
    status: 'draft' as 'draft' | 'published' | 'archived'
  });
  const [savingBlog, setSavingBlog] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Analytics state
  const [analyticsOverview, setAnalyticsOverview] = useState<AnalyticsOverview | null>(null);
  const [pageStats, setPageStats] = useState<PageStats[]>([]);
  const [referrerStats, setReferrerStats] = useState<ReferrerStats[]>([]);
  const [trafficPatterns, setTrafficPatterns] = useState<TrafficPattern[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [trafficPeriod, setTrafficPeriod] = useState<'daily' | 'hourly'>('daily');

  // Project state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [projectFilters, setProjectFilters] = useState({
    category: 'all',
    page: 1,
    limit: 10
  });
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image: '',
    technologies: [] as string[],
    category: 'General',
    liveUrl: '',
    githubUrl: '',
    featured: true,
    views: 0,
    likes: 0,
    completedAt: new Date().toISOString()
  });
  const [savingProject, setSavingProject] = useState(false);
  const [projectTagInput, setProjectTagInput] = useState('');
  const [projectPagination, setProjectPagination] = useState<ProjectPagination>({
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
    hasNext: false,
    hasPrev: false
  });

  // Settings state
  const [settings, setSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    adminEmail: '',
    theme: 'auto',
    homepageMessage: '',
    socialLinks: '',
    logo: '',
    maintenanceMode: false,
  });

  // User management state
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true,
  });
  const [savingUser, setSavingUser] = useState(false);
  const [userFilters, setUserFilters] = useState({ role: 'all', page: 1, limit: 10 });
  const [userPagination, setUserPagination] = useState({ currentPage: 1, totalPages: 1, totalUsers: 0, hasNext: false, hasPrev: false });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [activityLimit, setActivityLimit] = useState(5);

  const [aboutData, setAboutData] = useState<any>(null);
  const [loadingAbout, setLoadingAbout] = useState(false);
  const [aboutError, setAboutError] = useState<string | null>(null);
  const [savingAbout, setSavingAbout] = useState(false);

  const { user, isDeveloper, logout } = useAuth();
  const navigate = useNavigate();

  const defaultAboutData = {
    heading: 'About Me',
    intro: "Passionate full-stack developer with a love for creating innovative solutions and pushing the boundaries of what's possible on the web.",
    whoIAm: {
      title: 'Who I Am',
      paragraphs: [
        "I'm Saransh Nimje, a passionate full-stack developer with a deep love for creating innovative digital solutions. My journey in technology began with a curiosity about how the web works, and it has evolved into a commitment to building scalable, user-centric applications that make a real impact.",
        "With expertise in modern web technologies like React, Node.js, TypeScript, and SQL databases, I specialize in creating robust full-stack applications that deliver exceptional user experiences. I believe in writing clean, maintainable code and staying current with the latest industry trends.",
        "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community. I'm always eager to learn and take on new challenges that push my skills forward.",
        "My approach combines technical excellence with creative problem-solving, ensuring that every project I work on is not only functional but also delivers an outstanding user experience that exceeds expectations."
      ]
    },
    skills: [
      { name: 'React', level: 90, color: '#61DAFB' },
      { name: 'Node.js', level: 85, color: '#339933' },
      { name: 'TypeScript', level: 80, color: '#3178C6' },
      { name: 'SQLite', level: 75, color: '#003B57' },
      { name: 'Python', level: 70, color: '#3776AB' },
      { name: 'AWS', level: 65, color: '#FF9900' }
    ],
    stats: [
      { label: 'Years Experience', value: '3+' },
      { label: 'Projects Completed', value: '50+' },
      { label: 'Happy Clients', value: '30+' },
      { label: 'Technologies', value: '20+' }
    ],
    experience: [
      {
        year: '2025 - Present',
        title: 'B.Tech Student & Tech Enthusiast',
        company: 'Baderia Global Institute of Engineering and Management',
        description: 'Currently pursuing B.Tech in CSE (IoT & Cyber Security, including Blockchain Technology). Actively participating in coding clubs, technical workshops, and student-led tech initiatives.'
      },
      {
        year: '2024 - 2025',
        title: 'Personal Portfolio Project',
        company: 'Self-Driven',
        description: 'Designed and developed a personal portfolio website using React, Node.js, and TypeScript to showcase projects and skills.'
      },
      {
        year: '2023 - 2024',
        title: 'Open Source Contributor',
        company: 'GitHub',
        description: 'Contributed to open-source projects, focusing on bug fixes and feature enhancements in web development repositories.'
      },
      {
        year: '2022 - 2023',
        title: 'School Coding Club Member',
        company: 'ADITYA CONVENT SR. SEC. SCHOOL',
        description: 'Participated in school-level coding competitions and collaborated on group projects, building foundational programming skills.'
      }
    ],
    education: [
      {
        year: '2025 - Present',
        degree: 'B.Tech in CSE (IoT & Cyber Security, including Blockchain Technology)',
        school: 'Baderia Global Institute of Engineering and Management, Jabalpur (RGPV Bhopal)',
        description: 'Currently in 1st year, 1st semester. Started college journey in 2025.'
      },
      {
        year: '2024 - 25',
        degree: 'Class 12th (CBSE)',
        school: 'ADITYA CONVENT SR. SEC. SCHOOL, JABALPUR',
        description: 'Completed Class 12th from CBSE board.'
      },
      {
        year: '2022 - 23',
        degree: 'Class 10th (CBSE)',
        school: 'ADITYA CONVENT SR. SEC. SCHOOL, JABALPUR',
        description: 'Completed Class 10th from CBSE board.'
      }
    ]
  };

  useEffect(() => {
    // Check if admin is authenticated
    if (!isDeveloper) {
      navigate('/admin/login');
      return;
    }
    // Fetch real stats from backend
    setLoadingStats(true);
    setStatsError(null);
    fetch('/api/analytics/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        } else {
          setStatsError('Failed to load stats');
        }
        setLoadingStats(false);
      })
      .catch(() => {
        setStatsError('Failed to load stats');
        setLoadingStats(false);
      });
  }, [isDeveloper, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'fas fa-chart-line' },
    { id: 'projects', name: 'Projects', icon: 'fas fa-code' },
    { id: 'blog', name: 'Blog Posts', icon: 'fas fa-blog' },
    { id: 'about', name: 'About', icon: 'fas fa-user' },
    { id: 'contacts', name: 'Contacts', icon: 'fas fa-envelope' },
    { id: 'analytics', name: 'Analytics', icon: 'fas fa-chart-bar' },
    { id: 'settings', name: 'Settings', icon: 'fas fa-cog' },
    ...(isDeveloper ? [{ id: 'users', name: 'Users', icon: 'fas fa-users' }] : [])
  ];

  const quickActions = [
    { name: 'Add New Project', icon: 'fas fa-plus', action: () => setActiveTab('projects') },
    { name: 'Create Blog Post', icon: 'fas fa-edit', action: () => setActiveTab('blog') },
    { name: 'View Analytics', icon: 'fas fa-chart-bar', action: () => setActiveTab('analytics') },
    { name: 'Manage Settings', icon: 'fas fa-cog', action: () => setActiveTab('settings') }
  ];

  // Contact management functions
  const fetchContacts = async () => {
    setLoadingContacts(true);
    setContactError(null);
    try {
      const params = new URLSearchParams({
        page: contactFilters.page.toString(),
        limit: contactFilters.limit.toString(),
        ...(contactFilters.status !== 'all' && { status: contactFilters.status })
      });
      
      const response = await fetch(`/api/contacts?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data.contacts);
        setPagination(data.data.pagination);
      } else {
        setContactError('Failed to load contacts');
      }
    } catch (error) {
      setContactError('Failed to load contacts');
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchContactStats = async () => {
    try {
      const response = await fetch('/api/contacts/stats/overview');
      const data = await response.json();
      
      if (data.success) {
        setContactStats(data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch contact stats:', error);
    }
  };

  const markContactAsRead = async (contactId: number) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}/read`, {
        method: 'PATCH'
      });
      const data = await response.json();
      
      if (data.success) {
        setContacts(prev => prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, status: 'read' as const }
            : contact
        ));
        if (selectedContact?.id === contactId) {
          setSelectedContact(prev => prev ? { ...prev, status: 'read' as const } : null);
        }
      }
    } catch (error) {
      console.error('Failed to mark contact as read:', error);
    }
  };

  const replyToContact = async (contactId: number) => {
    if (!replyMessage.trim()) return;
    
    setSendingReply(true);
    try {
      const response = await fetch(`/api/contacts/${contactId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ replyMessage: replyMessage.trim() })
      });
      const data = await response.json();
      
      if (data.success) {
        setContacts(prev => prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, status: 'replied' as const, repliedAt: new Date().toISOString() }
            : contact
        ));
        if (selectedContact?.id === contactId) {
          setSelectedContact(prev => prev ? { 
            ...prev, 
            status: 'replied' as const, 
            repliedAt: new Date().toISOString() 
          } : null);
        }
        setShowReplyModal(false);
        setReplyMessage('');
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setSendingReply(false);
    }
  };

  const archiveContact = async (contactId: number) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}/archive`, {
        method: 'PATCH'
      });
      const data = await response.json();
      
      if (data.success) {
        setContacts(prev => prev.map(contact => 
          contact.id === contactId 
            ? { ...contact, status: 'archived' as const }
            : contact
        ));
        if (selectedContact?.id === contactId) {
          setSelectedContact(prev => prev ? { ...prev, status: 'archived' as const } : null);
        }
      }
    } catch (error) {
      console.error('Failed to archive contact:', error);
    }
  };

  const deleteContact = async (contactId: number) => {
    if (!window.confirm('Are you sure you want to delete this contact message? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
        if (selectedContact?.id === contactId) {
          setSelectedContact(null);
          setShowContactModal(false);
        }
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const openContactDetails = async (contactId: number) => {
    try {
      const response = await fetch(`/api/contacts/${contactId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedContact(data.data.contact);
        setShowContactModal(true);
        
        // Mark as read if it's new
        if (data.data.contact.status === 'new') {
          await markContactAsRead(contactId);
        }
      }
    } catch (error) {
      console.error('Failed to fetch contact details:', error);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof contactFilters>) => {
    setContactFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Fetch contacts when contacts tab is active
  useEffect(() => {
    if (activeTab === 'contacts') {
      fetchContacts();
      fetchContactStats();
    }
  }, [activeTab, contactFilters]);

  // Blog management functions
  const fetchBlogPosts = async () => {
    setLoadingBlogs(true);
    setBlogError(null);
    try {
      const params = new URLSearchParams({
        page: blogFilters.page.toString(),
        limit: blogFilters.limit.toString(),
        ...(blogFilters.status !== 'all' && { status: blogFilters.status }),
        ...(blogFilters.category !== 'all' && { category: blogFilters.category })
      });
      
      const response = await fetch(`/api/blog?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setBlogPosts(data.data.posts);
        setBlogPagination(data.data.pagination);
      } else {
        setBlogError(data.message || 'Failed to load blog posts');
        console.error('Blog API error:', data);
      }
    } catch (error: any) {
      setBlogError(error?.message || 'Failed to load blog posts');
      console.error('Blog fetch error:', error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const createBlogPost = async (postData: any) => {
    setSavingBlog(true);
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowBlogModal(false);
        setBlogForm({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          featuredImage: '',
          tags: [],
          category: 'General',
          authorName: 'Saransh Nimje',
          authorAvatar: '',
          readTime: 5,
          status: 'draft'
        });
        fetchBlogPosts();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Failed to create blog post' };
    } finally {
      setSavingBlog(false);
    }
  };

  const updateBlogPost = async (id: string, postData: any) => {
    setSavingBlog(true);
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowBlogModal(false);
        setSelectedBlog(null);
        setBlogForm({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          featuredImage: '',
          tags: [],
          category: 'General',
          authorName: 'Saransh Nimje',
          authorAvatar: '',
          readTime: 5,
          status: 'draft'
        });
        fetchBlogPosts();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Failed to update blog post' };
    } finally {
      setSavingBlog(false);
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/blog/${id}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
          fetchBlogPosts();
        } else {
          alert('Failed to delete blog post');
        }
      } catch (error) {
        alert('Failed to delete blog post');
      }
    }
  };

  const openBlogModal = (blog?: BlogPost) => {
    if (blog) {
      console.log('Editing blog:', blog); // <-- Add this line
      setSelectedBlog(blog);
      setBlogForm({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        featuredImage: blog.featuredImage,
        tags: blog.tags,
        category: blog.category,
        authorName: blog.author.name,
        authorAvatar: blog.author.avatar,
        readTime: blog.readTime,
        status: blog.status
      });
    } else {
      setSelectedBlog(null);
      setBlogForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        tags: [],
        category: 'General',
        authorName: 'Saransh Nimje',
        authorAvatar: '',
        readTime: 5,
        status: 'draft'
      });
    }
    setShowBlogModal(true);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...blogForm,
      tags: blogForm.tags
    };
    
    let result;
    if (selectedBlog) {
      result = await updateBlogPost(selectedBlog.id, postData);
    } else {
      result = await createBlogPost(postData);
    }
    
    if (!result.success) {
      alert(result.message);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !blogForm.tags.includes(tagInput.trim())) {
      setBlogForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setBlogForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleBlogFilterChange = (newFilters: Partial<typeof blogFilters>) => {
    setBlogFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Fetch blog posts when blog tab is active
  useEffect(() => {
    if (activeTab === 'blog') {
      fetchBlogPosts();
    }
  }, [activeTab, blogFilters]);

  // Analytics functions
  const fetchAnalyticsData = async () => {
    setLoadingAnalytics(true);
    setAnalyticsError(null);
    
    try {
      // Fetch all analytics data in parallel
      const [overviewRes, pagesRes, referrersRes, trafficRes, devicesRes] = await Promise.all([
        fetch('/api/analytics/overview'),
        fetch('/api/analytics/pages'),
        fetch('/api/analytics/referrers'),
        fetch(`/api/analytics/traffic-patterns?period=${trafficPeriod}`),
        fetch('/api/analytics/devices')
      ]);

      const [overviewData, pagesData, referrersData, trafficData, devicesData] = await Promise.all([
        overviewRes.json(),
        pagesRes.json(),
        referrersRes.json(),
        trafficRes.json(),
        devicesRes.json()
      ]);

      if (overviewData.success) setAnalyticsOverview(overviewData.data);
      if (pagesData.success) setPageStats(pagesData.data);
      if (referrersData.success) setReferrerStats(referrersData.data);
      if (trafficData.success) setTrafficPatterns(trafficData.data);
      if (devicesData.success) setDeviceStats(devicesData.data);

    } catch (error) {
      setAnalyticsError('Failed to load analytics data');
      console.error('Analytics fetch error:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const resetAnalytics = async () => {
    if (window.confirm('Are you sure you want to reset all analytics data? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/analytics/reset', { method: 'DELETE' });
        const data = await response.json();
        
        if (data.success) {
          // Refresh analytics data
          fetchAnalyticsData();
        }
      } catch (error) {
        console.error('Failed to reset analytics:', error);
      }
    }
  };

  // Fetch analytics data when analytics tab is active
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalyticsData();
    }
  }, [activeTab, trafficPeriod]);

  // Project management functions
  const fetchProjects = async () => {
    setLoadingProjects(true);
    setProjectError(null);
    try {
      const params = {
        page: projectFilters.page,
        limit: projectFilters.limit,
        ...(projectFilters.category !== 'all' && { category: projectFilters.category })
      };
      
      const response = await projectAPI.getAll(params);
      
      if (response.success) {
        setProjects(response.data);
        setProjectPagination({
          currentPage: projectFilters.page,
          totalPages: Math.ceil(response.data.length / projectFilters.limit),
          totalProjects: response.data.length,
          hasNext: response.data.length >= projectFilters.limit,
          hasPrev: projectFilters.page > 1
        });
      } else {
        setProjectError(response.message || 'Failed to load projects');
        console.error('Project API error:', response);
      }
    } catch (error: any) {
      setProjectError(error?.response?.data?.message || error?.message || 'Failed to load projects');
      console.error('Project fetch error:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const createProject = async (projectData: any) => {
    setSavingProject(true);
    try {
      const response = await projectAPI.create(projectData);
      
      if (response.success) {
        setShowProjectModal(false);
        setProjectForm({
          title: '',
          description: '',
          image: '',
          technologies: [],
          category: 'General',
          liveUrl: '',
          githubUrl: '',
          featured: true,
          views: 0,
          likes: 0,
          completedAt: new Date().toISOString()
        });
        fetchProjects();
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to create project' };
    } finally {
      setSavingProject(false);
    }
  };

  const updateProject = async (id: number, projectData: any) => {
    setSavingProject(true);
    try {
      const response = await projectAPI.update(id, projectData);
      
      if (response.success) {
        setShowProjectModal(false);
        setSelectedProject(null);
        setProjectForm({
          title: '',
          description: '',
          image: '',
          technologies: [],
          category: 'General',
          liveUrl: '',
          githubUrl: '',
          featured: true,
          views: 0,
          likes: 0,
          completedAt: new Date().toISOString()
        });
        fetchProjects();
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Failed to update project' };
    } finally {
      setSavingProject(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        const response = await projectAPI.delete(id);
        
        if (response.success) {
          fetchProjects();
        } else {
          alert('Failed to delete project');
        }
      } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  const openProjectModal = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      setProjectForm({
        title: project.title,
        description: project.description,
        image: project.image,
        technologies: project.technologies,
        category: project.category,
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        featured: project.featured,
        views: project.views,
        likes: project.likes,
        completedAt: project.completedAt
      });
    } else {
      setSelectedProject(null);
      setProjectForm({
        title: '',
        description: '',
        image: '',
        technologies: [],
        category: 'General',
        liveUrl: '',
        githubUrl: '',
        featured: true,
        views: 0,
        likes: 0,
        completedAt: new Date().toISOString()
      });
    }
    setShowProjectModal(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      ...projectForm,
      technologies: projectForm.technologies
    };
    
    let result;
    if (selectedProject) {
      result = await updateProject(selectedProject.id, projectData);
    } else {
      result = await createProject(projectData);
    }
    
    if (!result.success) {
      alert(result.message);
    }
  };

  const addProjectTag = () => {
    if (projectTagInput.trim() && !projectForm.technologies.includes(projectTagInput.trim())) {
      setProjectForm(prev => ({
        ...prev,
        technologies: [...prev.technologies, projectTagInput.trim()]
      }));
      setProjectTagInput('');
    }
  };

  const removeProjectTag = (tagToRemove: string) => {
    setProjectForm(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleProjectFilterChange = (newFilters: Partial<typeof projectFilters>) => {
    setProjectFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Fetch projects when projects tab is active
  useEffect(() => {
    if (activeTab === 'projects') {
      fetchProjects();
    }
  }, [activeTab, projectFilters]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(s => ({ ...s, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: Implement save logic here
    alert('Settings saved (not really, this is a placeholder)!');
  };

  // Fetch users when users tab is active
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUserError(null);
    try {
      const params: any = { page: userFilters.page, limit: userFilters.limit };
      if (userFilters.role !== 'all') params.role = userFilters.role;
      const res = await authAPI.getUsers(params);
      if (res.success) {
        setUsers(res.data.users);
        setUserPagination(res.data.pagination);
      } else {
        setUserError('Failed to load users');
      }
    } catch {
      setUserError('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, userFilters]);

  const openUserModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        role: user.role,
        isActive: user.isActive !== false,
      });
    } else {
      setEditingUser(null);
      setUserForm({ firstName: '', lastName: '', email: '', password: '', role: 'user', isActive: true });
    }
    setShowUserModal(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingUser(true);
    try {
      if (editingUser) {
        // Edit user
        const updateData: any = { ...userForm };
        if (!userForm.password) delete updateData.password;
        // Check if role has changed
        if (editingUser.role !== userForm.role) {
          const roleRes = await authAPI.updateUserRole(editingUser.id, userForm.role);
          if (!roleRes.success) {
            alert(roleRes.message || 'Failed to update user role');
            setSavingUser(false);
            return;
          }
        }
        // Remove role from updateData to avoid sending it to the general update endpoint
        delete updateData.role;
        const res = await authAPI.updateUser(editingUser.id, updateData);
        if (res.success) {
          setShowUserModal(false);
          fetchUsers();
        } else {
          alert(res.message || 'Failed to update user');
        }
      } else {
        // Create user
        if (!userForm.password) {
          alert('Password is required for new users');
          setSavingUser(false);
          return;
        }
        const res = await authAPI.createUser(userForm);
        if (res.success) {
          setShowUserModal(false);
          fetchUsers();
        } else {
          alert(res.message || 'Failed to create user');
        }
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save user');
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setSavingUser(true);
    try {
      const res = await authAPI.deleteUser(userId);
      if (res.success) {
        fetchUsers();
      } else {
        alert(res.message || 'Failed to delete user');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete user');
    } finally {
      setSavingUser(false);
    }
  };

  const handleUserFilterChange = (newFilters: Partial<typeof userFilters>) => {
    setUserFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  useEffect(() => {
    const fetchRecentActivity = async () => {
      setLoadingActivity(true);
      setActivityError(null);
      try {
        const activityResponse = await fetch(`/api/admin/recent-activity?limit=${activityLimit}`);
        if (!activityResponse.ok) throw new Error('Failed to fetch recent activity');
        const data = await activityResponse.json();
        setRecentActivity(data.recent || []);
      } catch (err: any) {
        setActivityError(err.message || 'Error fetching activity');
      } finally {
        setLoadingActivity(false);
      }
    };
    fetchRecentActivity();
  }, [activityLimit]);

  useEffect(() => {
    if (activeTab === 'about') {
      setLoadingAbout(true);
      setAboutError(null);
      aboutAPI.getAbout()
        .then(res => {
          if (res.success && res.data && Object.keys(res.data).length > 0) {
            // Merge backend data with defaultAboutData for missing keys
            setAboutData({ ...defaultAboutData, ...res.data });
          } else {
            setAboutData(defaultAboutData);
          }
        })
        .catch(() => setAboutData(defaultAboutData))
        .finally(() => setLoadingAbout(false));
    }
  }, [activeTab]);

  const handleAboutChange = (field: string, value: any) => {
    setAboutData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAboutListChange = (section: string, idx: number, key: string, value: any) => {
    setAboutData((prev: any) => ({
      ...prev,
      [section]: prev[section].map((item: any, i: number) => i === idx ? { ...item, [key]: value } : item)
    }));
  };

  const handleAboutListAdd = (section: string, emptyItem: any) => {
    setAboutData((prev: any) => ({ ...prev, [section]: [...prev[section], emptyItem] }));
  };

  const handleAboutListRemove = (section: string, idx: number) => {
    setAboutData((prev: any) => ({ ...prev, [section]: prev[section].filter((_: any, i: number) => i !== idx) }));
  };

  const handleAboutSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAbout(true);
    setAboutError(null);
    try {
      const res = await aboutAPI.updateAbout(aboutData);
      if (!res.success) setAboutError('Failed to save About content');
    } catch {
      setAboutError('Failed to save About content');
    } finally {
      setSavingAbout(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-white font-bold">Admin Panel</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">
                <i className="fas fa-user-shield mr-2"></i>
                {user?.name || 'Developer'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-screen">
          <nav className="mt-8">
            <div className="px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <i className={`${tab.icon} mr-3`}></i>
                  {tab.name}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {tabs.find(tab => tab.id === activeTab)?.name}
            </h1>
            <p className="text-gray-400">
              Manage your portfolio website content and settings
            </p>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stats Cards */}
              {loadingStats ? (
                <div className="text-white mb-8">Loading stats...</div>
              ) : statsError ? (
                <div className="text-red-400 mb-8">{statsError}</div>
              ) : stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Total Visitors', value: stats.totalVisitors, icon: 'fas fa-users', color: 'bg-blue-600' },
                    { label: 'Projects', value: stats.totalProjects, icon: 'fas fa-code', color: 'bg-green-600' },
                    { label: 'Blog Posts', value: stats.totalBlogPosts, icon: 'fas fa-blog', color: 'bg-purple-600' },
                    { label: 'Contacts', value: stats.totalContacts, icon: 'fas fa-envelope', color: 'bg-orange-600' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">{stat.label}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <i className={`${stat.icon} text-white text-lg`}></i>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.name}
                      onClick={action.action}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
                    >
                      <i className={`${action.icon} text-red-400 text-xl mb-2`}></i>
                      <p className="text-white font-medium">{action.name}</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {loadingActivity ? (
                    <div className="text-gray-400">Loading...</div>
                  ) : activityError ? (
                    <div className="text-red-400">{activityError}</div>
                  ) : recentActivity.length === 0 ? (
                    <div className="text-gray-400">No recent activity</div>
                  ) : (
                    recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'contact' ? 'bg-blue-500' :
                            activity.type === 'project' ? 'bg-green-500' :
                            activity.type === 'blog' ? 'bg-purple-500' : 'bg-orange-500'
                          }`}></div>
                          <span className="text-gray-300">{activity.action}</span>
                        </div>
                        <span className="text-gray-500 text-sm">{formatDistanceToNow(new Date(activity.date), { addSuffix: true })}</span>
                      </motion.div>
                    ))
                  )}
                  {(!loadingActivity && !activityError && recentActivity.length >= activityLimit) && (
                    <button
                      className="w-full mt-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-center font-semibold"
                      onClick={() => setActivityLimit(activityLimit + 5)}
                    >
                      View More
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Project Header */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Manage Projects</h2>
                  <button 
                    onClick={() => openProjectModal()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add New Project
                  </button>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Projects', value: projects.length, icon: 'fas fa-code', color: 'bg-blue-600' },
                    { label: 'Featured', value: projects.filter(p => p.featured).length, icon: 'fas fa-star', color: 'bg-yellow-600' },
                    { label: 'Total Views', value: projects.reduce((sum, p) => sum + p.views, 0), icon: 'fas fa-eye', color: 'bg-green-600' },
                    { label: 'Total Likes', value: projects.reduce((sum, p) => sum + p.likes, 0), icon: 'fas fa-heart', color: 'bg-red-600' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">{stat.label}</p>
                          <p className="text-xl font-bold text-white">{stat.value}</p>
                        </div>
                        <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <i className={`${stat.icon} text-white`}></i>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Category Filter</label>
                    <select
                      value={projectFilters.category}
                      onChange={(e) => handleProjectFilterChange({ category: e.target.value })}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                    >
                      <option value="all">All Categories</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Desktop Application">Desktop Application</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Data Science">Data Science</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Items per page</label>
                    <select
                      value={projectFilters.limit}
                      onChange={(e) => handleProjectFilterChange({ limit: parseInt(e.target.value) })}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Projects List */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {loadingProjects ? (
                  <div className="p-8 text-center">
                    <div className="text-white">Loading projects...</div>
                  </div>
                ) : projectError ? (
                  <div className="p-8 text-center">
                    <div className="text-red-400">{projectError}</div>
                    <div className="text-xs text-gray-500 mt-2">Check the browser console for more details.</div>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400">No projects found</div>
                    <button 
                      onClick={() => openProjectModal()}
                      className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Add Your First Project
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Technologies</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stats</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Featured</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {projects.map((project) => (
                            <tr
                              key={project.id}
                              className="hover:bg-gray-700 transition-colors cursor-pointer"
                              onClick={() => openProjectModal(project)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-12 w-12">
                                    <img 
                                      className="h-12 w-12 rounded-lg object-cover" 
                                      src={project.image || '/placeholder-project.jpg'} 
                                      alt={project.title}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">{project.title}</div>
                                    <div className="text-sm text-gray-400">{project.description.substring(0, 60)}...</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-300">{project.category}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                  {project.technologies.slice(0, 3).map((tech, index) => (
                                    <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-600 text-gray-300">
                                      {tech}
                                    </span>
                                  ))}
                                  {project.technologies.length > 3 && (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-600 text-gray-300">
                                      +{project.technologies.length - 3}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                <div className="space-y-1">
                                  <div className="flex items-center">
                                    <i className="fas fa-eye mr-1"></i>
                                    {project.views}
                                  </div>
                                  <div className="flex items-center">
                                    <i className="fas fa-heart mr-1"></i>
                                    {project.likes}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  project.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {project.featured ? 'Featured' : 'Regular'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {new Date(project.completedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={e => { e.stopPropagation(); openProjectModal(project); }}
                                    className="text-blue-400 hover:text-blue-300"
                                    title="Edit Project"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  {project.liveUrl && (
                                    <a
                                      href={project.liveUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-green-400 hover:text-green-300"
                                      title="View Live"
                                      onClick={e => e.stopPropagation()}
                                    >
                                      <i className="fas fa-external-link-alt"></i>
                                    </a>
                                  )}
                                  {project.githubUrl && (
                                    <a
                                      href={project.githubUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-400 hover:text-gray-300"
                                      title="View GitHub"
                                      onClick={e => e.stopPropagation()}
                                    >
                                      <i className="fab fa-github"></i>
                                    </a>
                                  )}
                                  <button
                                    onClick={e => { e.stopPropagation(); deleteProject(project.id); }}
                                    className="text-red-400 hover:text-red-300"
                                    title="Delete Project"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'blog' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Blog Header */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Manage Blog Posts</h2>
                  <button 
                    onClick={() => openBlogModal()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Create New Post
                  </button>
                </div>

                {/* Blog Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Posts', value: blogPagination.totalPosts, icon: 'fas fa-file-alt', color: 'bg-blue-600' },
                    { label: 'Published', value: blogPosts.filter(p => p.status === 'published').length, icon: 'fas fa-check-circle', color: 'bg-green-600' },
                    { label: 'Drafts', value: blogPosts.filter(p => p.status === 'draft').length, icon: 'fas fa-edit', color: 'bg-yellow-600' },
                    { label: 'Archived', value: blogPosts.filter(p => p.status === 'archived').length, icon: 'fas fa-archive', color: 'bg-gray-600' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">{stat.label}</p>
                          <p className="text-xl font-bold text-white">{stat.value}</p>
                        </div>
                        <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <i className={`${stat.icon} text-white`}></i>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Status Filter</label>
                    <select
                      value={blogFilters.status}
                      onChange={(e) => handleBlogFilterChange({ status: e.target.value })}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Category Filter</label>
                    <select
                      value={blogFilters.category}
                      onChange={(e) => handleBlogFilterChange({ category: e.target.value })}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                    >
                      <option value="all">All Categories</option>
                      <option value="General">General</option>
                      <option value="Technology">Technology</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Tutorial">Tutorial</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Items per page</label>
                    <select
                      value={blogFilters.limit}
                      onChange={(e) => handleBlogFilterChange({ limit: parseInt(e.target.value) })}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Blog Posts List */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {loadingBlogs ? (
                  <div className="p-8 text-center">
                    <div className="text-white">Loading blog posts...</div>
                  </div>
                ) : blogError ? (
                  <div className="p-8 text-center">
                    <div className="text-red-400">{blogError}</div>
                    <div className="text-xs text-gray-500 mt-2">Check the browser console for more details.</div>
                  </div>
                ) : blogPosts.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400">No blog posts found</div>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Post</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Views</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {blogPosts.map((post) => (
                            <tr
                              key={post.id}
                              className="hover:bg-gray-700 transition-colors cursor-pointer"
                              onClick={() => openBlogModal(post)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-white">{post.title}</div>
                                  <div className="text-sm text-gray-400">{post.excerpt ? post.excerpt.substring(0, 60) + '...' : 'No excerpt'}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    <i className="fas fa-clock mr-1"></i>
                                    {post.readTime} min read
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-300">{post.category}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  post.status === 'published' ? 'bg-green-100 text-green-800' :
                                  post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {post.status ? post.status.charAt(0).toUpperCase() + post.status.slice(1) : 'Unknown'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                <div className="flex items-center">
                                  <i className="fas fa-eye mr-1"></i>
                                  {post.views}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={e => { e.stopPropagation(); openBlogModal(post); }}
                                    className="text-blue-400 hover:text-blue-300"
                                    title="Edit Post"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={e => { e.stopPropagation(); window.open(`/blog/${post.slug}`, '_blank'); }}
                                    className="text-green-400 hover:text-green-300"
                                    title="View Post"
                                  >
                                    <i className="fas fa-external-link-alt"></i>
                                  </button>
                                  <button
                                    onClick={e => { e.stopPropagation(); deleteBlogPost(post.id); }}
                                    className="text-red-400 hover:text-red-300"
                                    title="Delete Post"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {blogPagination.totalPages > 1 && (
                      <div className="bg-gray-700 px-6 py-3 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Showing {((blogPagination.currentPage - 1) * blogFilters.limit) + 1} to {Math.min(blogPagination.currentPage * blogFilters.limit, blogPagination.totalPosts)} of {blogPagination.totalPosts} posts
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleBlogFilterChange({ page: blogPagination.currentPage - 1 })}
                            disabled={!blogPagination.hasPrev}
                            className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                          >
                            Previous
                          </button>
                          <span className="px-3 py-1 text-gray-300">
                            Page {blogPagination.currentPage} of {blogPagination.totalPages}
                          </span>
                          <button
                            onClick={() => handleBlogFilterChange({ page: blogPagination.currentPage + 1 })}
                            disabled={!blogPagination.hasNext}
                            className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-4xl mx-auto"
            >
              <h2 className="text-xl font-bold text-white mb-6">Edit About Page Content</h2>
              {loadingAbout ? (
                <div className="text-white">Loading...</div>
              ) : aboutData ? (
                <form className="space-y-6" onSubmit={handleAboutSave}>
                  <div>
                    <label className="block text-gray-400 mb-1">Heading</label>
                    <input type="text" className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={aboutData.heading || ''} onChange={e => handleAboutChange('heading', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Intro</label>
                    <textarea className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={aboutData.intro || ''} onChange={e => handleAboutChange('intro', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Who I Am Title</label>
                    <input type="text" className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={aboutData.whoIAm?.title || ''} onChange={e => handleAboutChange('whoIAm', { ...aboutData.whoIAm, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Who I Am Paragraphs</label>
                    {(aboutData.whoIAm?.paragraphs || []).map((p: string, idx: number) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <textarea className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={p} onChange={e => handleAboutChange('whoIAm', { ...aboutData.whoIAm, paragraphs: aboutData.whoIAm.paragraphs.map((x: string, i: number) => i === idx ? e.target.value : x) })} />
                        <button type="button" className="text-red-400" onClick={() => handleAboutChange('whoIAm', { ...aboutData.whoIAm, paragraphs: aboutData.whoIAm.paragraphs.filter((_: string, i: number) => i !== idx) })}><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                    <button type="button" className="px-3 py-1 bg-gray-600 text-white rounded" onClick={() => handleAboutChange('whoIAm', { ...aboutData.whoIAm, paragraphs: [...(aboutData.whoIAm?.paragraphs || []), ''] })}>Add Paragraph</button>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Skills</label>
                    {(aboutData.skills || []).map((skill: any, idx: number) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input type="text" placeholder="Name" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={skill.name} onChange={e => handleAboutListChange('skills', idx, 'name', e.target.value)} />
                        <input type="number" placeholder="Level" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={skill.level} onChange={e => handleAboutListChange('skills', idx, 'level', e.target.value)} />
                        <input type="color" className="bg-gray-700 rounded border border-gray-600" value={skill.color} onChange={e => handleAboutListChange('skills', idx, 'color', e.target.value)} />
                        <button type="button" className="text-red-400" onClick={() => handleAboutListRemove('skills', idx)}><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                    <button type="button" className="px-3 py-1 bg-gray-600 text-white rounded" onClick={() => handleAboutListAdd('skills', { name: '', level: 0, color: '#000000' })}>Add Skill</button>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Stats</label>
                    {(aboutData.stats || []).map((stat: any, idx: number) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input type="text" placeholder="Label" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={stat.label} onChange={e => handleAboutListChange('stats', idx, 'label', e.target.value)} />
                        <input type="text" placeholder="Value" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={stat.value} onChange={e => handleAboutListChange('stats', idx, 'value', e.target.value)} />
                        <button type="button" className="text-red-400" onClick={() => handleAboutListRemove('stats', idx)}><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                    <button type="button" className="px-3 py-1 bg-gray-600 text-white rounded" onClick={() => handleAboutListAdd('stats', { label: '', value: '' })}>Add Stat</button>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Experience</label>
                    {(aboutData.experience || []).map((exp: any, idx: number) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input type="text" placeholder="Year" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={exp.year} onChange={e => handleAboutListChange('experience', idx, 'year', e.target.value)} />
                        <input type="text" placeholder="Title" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={exp.title} onChange={e => handleAboutListChange('experience', idx, 'title', e.target.value)} />
                        <input type="text" placeholder="Company" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={exp.company} onChange={e => handleAboutListChange('experience', idx, 'company', e.target.value)} />
                        <input type="text" placeholder="Description" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={exp.description} onChange={e => handleAboutListChange('experience', idx, 'description', e.target.value)} />
                        <button type="button" className="text-red-400" onClick={() => handleAboutListRemove('experience', idx)}><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                    <button type="button" className="px-3 py-1 bg-gray-600 text-white rounded" onClick={() => handleAboutListAdd('experience', { year: '', title: '', company: '', description: '' })}>Add Experience</button>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Education</label>
                    {(aboutData.education || []).map((edu: any, idx: number) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <input type="text" placeholder="Year" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={edu.year} onChange={e => handleAboutListChange('education', idx, 'year', e.target.value)} />
                        <input type="text" placeholder="Degree" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={edu.degree} onChange={e => handleAboutListChange('education', idx, 'degree', e.target.value)} />
                        <input type="text" placeholder="School" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={edu.school} onChange={e => handleAboutListChange('education', idx, 'school', e.target.value)} />
                        <input type="text" placeholder="Description" className="bg-gray-700 text-white px-2 py-1 rounded border border-gray-600" value={edu.description} onChange={e => handleAboutListChange('education', idx, 'description', e.target.value)} />
                        <button type="button" className="text-red-400" onClick={() => handleAboutListRemove('education', idx)}><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                    <button type="button" className="px-3 py-1 bg-gray-600 text-white rounded" onClick={() => handleAboutListAdd('education', { year: '', degree: '', school: '', description: '' })}>Add Education</button>
                  </div>
                  {aboutError && <div className="text-red-400">{aboutError}</div>}
                  <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors" disabled={savingAbout || loadingAbout}>{savingAbout ? 'Saving...' : 'Save About Content'}</button>
                </form>
              ) : aboutError ? (
                <div className="text-red-400">{aboutError}</div>
              ) : null}
            </motion.div>
          )}

          {activeTab === 'contacts' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Contact Stats */}
              {contactStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'New', value: contactStats.new || 0, color: 'bg-blue-600', icon: 'fas fa-envelope' },
                    { label: 'Read', value: contactStats.read || 0, color: 'bg-green-600', icon: 'fas fa-eye' },
                    { label: 'Replied', value: contactStats.replied || 0, color: 'bg-purple-600', icon: 'fas fa-reply' },
                    { label: 'Archived', value: contactStats.archived || 0, color: 'bg-gray-600', icon: 'fas fa-archive' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">{stat.label}</p>
                          <p className="text-xl font-bold text-white">{stat.value}</p>
                        </div>
                        <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <i className={`${stat.icon} text-white`}></i>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Filters */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Status Filter</label>
                    <select
                      value={contactFilters.status}
                      onChange={(e) => handleFilterChange({ status: e.target.value })}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                    >
                      <option value="all">All Messages</option>
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Items per page</label>
                    <select
                      value={contactFilters.limit}
                      onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contacts List */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {loadingContacts ? (
                  <div className="p-8 text-center">
                    <div className="text-white">Loading contacts...</div>
                  </div>
                ) : contactError ? (
                  <div className="p-8 text-center">
                    <div className="text-red-400">{contactError}</div>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400">No contacts found</div>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {contacts.map((contact) => (
                            <tr
                              key={contact.id}
                              className="hover:bg-gray-700 transition-colors cursor-pointer"
                              onClick={() => openContactDetails(contact.id)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-white">{contact.name}</div>
                                  <div className="text-sm text-gray-400">{contact.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-white max-w-xs truncate">{contact.subject}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  contact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                  contact.status === 'read' ? 'bg-green-100 text-green-800' :
                                  contact.status === 'replied' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {contact.status ? contact.status.charAt(0).toUpperCase() + contact.status.slice(1) : 'Unknown'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {new Date(contact.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={e => { e.stopPropagation(); openContactDetails(contact.id); }}
                                    className="text-blue-400 hover:text-blue-300"
                                    title="View Details"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  {contact.status === 'new' && (
                                    <button
                                      onClick={e => { e.stopPropagation(); markContactAsRead(contact.id); }}
                                      className="text-green-400 hover:text-green-300"
                                      title="Mark as Read"
                                    >
                                      <i className="fas fa-check"></i>
                                    </button>
                                  )}
                                  {contact.status !== 'replied' && contact.status !== 'archived' && (
                                    <button
                                      onClick={e => { e.stopPropagation(); setSelectedContact(contact); setShowReplyModal(true); }}
                                      className="text-purple-400 hover:text-purple-300"
                                      title="Reply"
                                    >
                                      <i className="fas fa-reply"></i>
                                    </button>
                                  )}
                                  {contact.status !== 'archived' && (
                                    <button
                                      onClick={e => { e.stopPropagation(); archiveContact(contact.id); }}
                                      className="text-gray-400 hover:text-gray-300"
                                      title="Archive"
                                    >
                                      <i className="fas fa-archive"></i>
                                    </button>
                                  )}
                                  <button
                                    onClick={e => { e.stopPropagation(); deleteContact(contact.id); }}
                                    className="text-red-400 hover:text-red-300"
                                    title="Delete"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="px-6 py-4 bg-gray-700 border-t border-gray-600">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400">
                            Showing {((pagination.currentPage - 1) * contactFilters.limit) + 1} to {Math.min(pagination.currentPage * contactFilters.limit, pagination.totalContacts)} of {pagination.totalContacts} contacts
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleFilterChange({ page: pagination.currentPage - 1 })}
                              disabled={!pagination.hasPrev}
                              className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                            >
                              Previous
                            </button>
                            <span className="px-3 py-1 text-gray-400">
                              Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <button
                              onClick={() => handleFilterChange({ page: pagination.currentPage + 1 })}
                              disabled={!pagination.hasNext}
                              className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Analytics Header */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Website Analytics</h2>
                  <button
                    onClick={resetAnalytics}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Reset Analytics
                  </button>
                </div>
                
                {loadingAnalytics ? (
                  <div className="flex justify-center items-center py-8">
                    <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                  </div>
                ) : analyticsError ? (
                  <div className="text-red-400 text-center py-8">{analyticsError}</div>
                ) : (
                  <>
                    {/* Overview Cards */}
                    {analyticsOverview && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-500 rounded-lg">
                              <i className="fas fa-users text-white"></i>
                            </div>
                            <div className="ml-4">
                              <p className="text-gray-400 text-sm">Total Visitors</p>
                              <p className="text-white text-xl font-bold">{analyticsOverview.totalVisitors}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-500 rounded-lg">
                              <i className="fas fa-eye text-white"></i>
                            </div>
                            <div className="ml-4">
                              <p className="text-gray-400 text-sm">Page Views</p>
                              <p className="text-white text-xl font-bold">{analyticsOverview.totalPageViews}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-purple-500 rounded-lg">
                              <i className="fas fa-user-friends text-white"></i>
                            </div>
                            <div className="ml-4">
                              <p className="text-gray-400 text-sm">Unique Visitors</p>
                              <p className="text-white text-xl font-bold">{analyticsOverview.uniqueVisitors}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center">
                            <div className="p-2 bg-yellow-500 rounded-lg">
                              <i className="fas fa-chart-line text-white"></i>
                            </div>
                            <div className="ml-4">
                              <p className="text-gray-400 text-sm">Avg. Pages/Visitor</p>
                              <p className="text-white text-xl font-bold">{analyticsOverview.averagePageViewsPerVisitor}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Traffic Patterns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-white">Traffic Patterns</h3>
                          <select
                            value={trafficPeriod}
                            onChange={(e) => setTrafficPeriod(e.target.value as 'daily' | 'hourly')}
                            className="bg-gray-600 text-white px-3 py-1 rounded border border-gray-500"
                          >
                            <option value="daily">Daily</option>
                            <option value="hourly">Hourly</option>
                          </select>
                        </div>
                        <div className="h-64 overflow-y-auto">
                          {trafficPatterns.length > 0 ? (
                            <div className="space-y-2">
                              {trafficPatterns.slice(-10).map((pattern, index) => (
                                <div key={index} className="flex justify-between items-center">
                                  <span className="text-gray-300 text-sm">{pattern.time}</span>
                                  <span className="text-white font-semibold">{pattern.count}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-center py-8">No traffic data available</p>
                          )}
                        </div>
                      </div>

                      {/* Top Pages */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
                        <div className="h-64 overflow-y-auto">
                          {pageStats.length > 0 ? (
                            <div className="space-y-3">
                              {pageStats.slice(0, 10).map((page, index) => (
                                <div key={index} className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <p className="text-white text-sm truncate">{page.page}</p>
                                    <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                                      <div 
                                        className="bg-blue-500 h-2 rounded-full" 
                                        style={{ width: `${page.percentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <span className="text-gray-300 text-sm ml-2">{page.views}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-center py-8">No page data available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Referrers and Devices */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      {/* Top Referrers */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Top Referrers</h3>
                        <div className="h-64 overflow-y-auto">
                          {referrerStats.length > 0 ? (
                            <div className="space-y-2">
                              {referrerStats.slice(0, 10).map((referrer, index) => (
                                <div key={index} className="flex justify-between items-center">
                                  <span className="text-gray-300 text-sm truncate">{referrer.referrer}</span>
                                  <span className="text-white font-semibold">{referrer.count}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-center py-8">No referrer data available</p>
                          )}
                        </div>
                      </div>

                      {/* Browser Statistics */}
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Browser Usage</h3>
                        <div className="h-64 overflow-y-auto">
                          {deviceStats?.browsers && deviceStats.browsers.length > 0 ? (
                            <div className="space-y-3">
                              {deviceStats.browsers.slice(0, 8).map((browser, index) => (
                                <div key={index} className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                    <span className="text-gray-300 text-sm">{browser.browser}</span>
                                  </div>
                                  <span className="text-white font-semibold">{browser.count}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 text-center py-8">No browser data available</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Screen Resolutions */}
                    {deviceStats?.screenResolutions && deviceStats.screenResolutions.length > 0 && (
                      <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Screen Resolutions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {deviceStats.screenResolutions.slice(0, 9).map((resolution, index) => (
                            <div key={index} className="bg-gray-600 rounded-lg p-3">
                              <p className="text-white text-sm font-semibold">{resolution.resolution}</p>
                              <p className="text-gray-400 text-xs">{resolution.count} users</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-xl font-bold text-white mb-6">Website Settings</h2>
              <form className="space-y-6" onSubmit={handleSettingsSave}>
                <div>
                  <label className="block text-gray-400 mb-1">Site Title</label>
                  <input type="text" className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={settings.siteTitle} onChange={e => setSettings(s => ({...s, siteTitle: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Site Description</label>
                  <textarea className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={settings.siteDescription} onChange={e => setSettings(s => ({...s, siteDescription: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Admin Email</label>
                  <input type="email" className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={settings.adminEmail} onChange={e => setSettings(s => ({...s, adminEmail: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Theme</label>
                  <select className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={settings.theme} onChange={e => setSettings(s => ({...s, theme: e.target.value}))}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Homepage Message</label>
                  <input type="text" className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={settings.homepageMessage} onChange={e => setSettings(s => ({...s, homepageMessage: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Social Media Links (comma separated)</label>
                  <input type="text" className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={settings.socialLinks} onChange={e => setSettings(s => ({...s, socialLinks: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Logo Upload</label>
                  <input type="file" className="w-full text-gray-400" onChange={handleLogoUpload} />
                  {settings.logo && <img src={settings.logo} alt="Logo Preview" className="mt-2 h-12" />}
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="maintenance" checked={settings.maintenanceMode} onChange={e => setSettings(s => ({...s, maintenanceMode: e.target.checked}))} className="mr-2" />
                  <label htmlFor="maintenance" className="text-gray-400">Maintenance Mode</label>
                </div>
                <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Save Settings</button>
              </form>
            </motion.div>
          )}

          {/* Contact Details Modal */}
          {showContactModal && selectedContact && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedContact.subject}</h3>
                      <p className="text-gray-400 mt-1">From: {selectedContact.name} ({selectedContact.email})</p>
                    </div>
                    <button
                      onClick={() => setShowContactModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Message</h4>
                    <div className="bg-gray-700 rounded-lg p-4 text-gray-300 whitespace-pre-wrap">
                      {selectedContact.message}
                    </div>
                  </div>
                  
                  {selectedContact.replyMessage && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-2">Your Reply</h4>
                      <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-lg p-4 text-gray-300 whitespace-pre-wrap">
                        {selectedContact.replyMessage}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Replied on: {new Date(selectedContact.repliedAt!).toLocaleString()}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedContact.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        selectedContact.status === 'read' ? 'bg-green-100 text-green-800' :
                        selectedContact.status === 'replied' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedContact.status ? selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1) : 'Unknown'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Date:</span>
                      <span className="ml-2 text-white">{new Date(selectedContact.createdAt).toLocaleString()}</span>
                    </div>
                    {selectedContact.ipAddress && (
                      <div>
                        <span className="text-gray-400">IP Address:</span>
                        <span className="ml-2 text-white">{selectedContact.ipAddress}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
                    {selectedContact.status !== 'replied' && selectedContact.status !== 'archived' && (
                      <button
                        onClick={() => {
                          setShowContactModal(false);
                          setShowReplyModal(true);
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <i className="fas fa-reply mr-2"></i>
                        Reply
                      </button>
                    )}
                    {selectedContact.status !== 'archived' && (
                      <button
                        onClick={() => archiveContact(selectedContact.id)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <i className="fas fa-archive mr-2"></i>
                        Archive
                      </button>
                    )}
                    <button
                      onClick={() => deleteContact(selectedContact.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <i className="fas fa-trash mr-2"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Reply Modal */}
          {showReplyModal && selectedContact && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-800 rounded-xl max-w-lg w-full"
              >
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Reply to {selectedContact.name}</h3>
                    <button
                      onClick={() => {
                        setShowReplyModal(false);
                        setReplyMessage('');
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>
                  <p className="text-gray-400 mt-1">Subject: {selectedContact.subject}</p>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">Your Reply</label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply message here..."
                      className="w-full h-32 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none resize-none"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowReplyModal(false);
                        setReplyMessage('');
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => replyToContact(selectedContact.id)}
                      disabled={!replyMessage.trim() || sendingReply}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sendingReply ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Blog Modal */}
          {showBlogModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                      {selectedBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                    </h3>
                    <button
                      onClick={() => setShowBlogModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleBlogSubmit} className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Title *</label>
                        <input
                          type="text"
                          value={blogForm.title}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter blog post title"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>

                      {/* Slug */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Slug *</label>
                        <input
                          type="text"
                          value={blogForm.slug}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="enter-blog-post-slug"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Category *</label>
                        <select
                          value={blogForm.category}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          required
                        >
                          <option value="General">General</option>
                          <option value="Technology">Technology</option>
                          <option value="Programming">Programming</option>
                          <option value="Design">Design</option>
                          <option value="Tutorial">Tutorial</option>
                        </select>
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Status *</label>
                        <select
                          value={blogForm.status}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' | 'archived' }))}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          required
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      {/* Read Time */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Read Time (minutes) *</label>
                        <input
                          type="number"
                          value={blogForm.readTime}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, readTime: parseInt(e.target.value) }))}
                          min="1"
                          max="60"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>

                      {/* Featured Image */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Featured Image URL</label>
                        <input
                          type="url"
                          value={blogForm.featuredImage}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, featuredImage: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      {/* Author Name */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Author Name *</label>
                        <input
                          type="text"
                          value={blogForm.authorName}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, authorName: e.target.value }))}
                          placeholder="Author name"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>

                      {/* Author Avatar */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Author Avatar URL</label>
                        <input
                          type="url"
                          value={blogForm.authorAvatar}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, authorAvatar: e.target.value }))}
                          placeholder="https://example.com/avatar.jpg"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Excerpt */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Excerpt *</label>
                        <textarea
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, excerpt: e.target.value }))}
                          placeholder="Brief description of the blog post"
                          rows={4}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none resize-none"
                          required
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Tags</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Add a tag and press Enter"
                            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={addTag}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {blogForm.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-600 text-white"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 hover:text-red-200"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Content *</label>
                        <textarea
                          value={blogForm.content}
                          onChange={(e) => setBlogForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Write your blog post content here..."
                          rows={12}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none resize-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowBlogModal(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingBlog}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingBlog ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          {selectedBlog ? 'Update Post' : 'Create Post'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Project Modal */}
          {showProjectModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                      {selectedProject ? 'Edit Project' : 'Create New Project'}
                    </h3>
                    <button
                      onClick={() => setShowProjectModal(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleProjectSubmit} className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Title *</label>
                        <input
                          type="text"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter project title"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Category *</label>
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          required
                        >
                          <option value="Web Development">Web Development</option>
                          <option value="Mobile Development">Mobile Development</option>
                          <option value="Desktop Application">Desktop Application</option>
                          <option value="Machine Learning">Machine Learning</option>
                          <option value="Data Science">Data Science</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                          <option value="General">General</option>
                        </select>
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Project Image URL *</label>
                        <input
                          type="url"
                          value={projectForm.image}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="https://example.com/project-image.jpg"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>

                      {/* Live URL */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Live URL</label>
                        <input
                          type="url"
                          value={projectForm.liveUrl}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, liveUrl: e.target.value }))}
                          placeholder="https://example.com"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      {/* GitHub URL */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">GitHub URL</label>
                        <input
                          type="url"
                          value={projectForm.githubUrl}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                          placeholder="https://github.com/username/repo"
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      {/* Completed Date */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Completion Date *</label>
                        <input
                          type="date"
                          value={projectForm.completedAt.split('T')[0]}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, completedAt: e.target.value }))}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          required
                        />
                      </div>

                      {/* Featured */}
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={projectForm.featured}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                            className="mr-2 bg-gray-700 border-gray-600 text-red-500 focus:ring-red-500 focus:ring-2"
                          />
                          <span className="text-gray-400 text-sm">Featured Project</span>
                        </label>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Description *</label>
                        <textarea
                          value={projectForm.description}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your project..."
                          rows={6}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none resize-none"
                          required
                        />
                      </div>

                      {/* Technologies */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Technologies</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={projectTagInput}
                            onChange={(e) => setProjectTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProjectTag())}
                            placeholder="Add a technology and press Enter"
                            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={addProjectTag}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {projectForm.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-600 text-white"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={() => removeProjectTag(tech)}
                                className="ml-2 hover:text-red-200"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats (Read-only for editing) */}
                      {selectedProject && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">Views</label>
                            <input
                              type="number"
                              value={projectForm.views}
                              onChange={(e) => setProjectForm(prev => ({ ...prev, views: parseInt(e.target.value) }))}
                              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">Likes</label>
                            <input
                              type="number"
                              value={projectForm.likes}
                              onChange={(e) => setProjectForm(prev => ({ ...prev, likes: parseInt(e.target.value) }))}
                              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowProjectModal(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={savingProject}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingProject ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          {selectedProject ? 'Update Project' : 'Create Project'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && isDeveloper && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Manage Users</h2>
                  <button
                    onClick={() => openUserModal()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Add User
                  </button>
                </div>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center px-6 py-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Role Filter</label>
                    <select
                      value={userFilters.role}
                      onChange={e => handleUserFilterChange({ role: e.target.value })}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                    >
                      <option value="all">All Roles</option>
                      <option value="user">User</option>
                      <option value="developer">Developer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Items per page</label>
                    <select
                      value={userFilters.limit}
                      onChange={e => handleUserFilterChange({ limit: parseInt(e.target.value) })}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
                {loadingUsers ? (
                  <div className="p-8 text-center text-white">Loading users...</div>
                ) : userError ? (
                  <div className="p-8 text-center text-red-400">{userError}</div>
                ) : users.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No users found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Active</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {users.map((u) => (
                          <tr
                            key={u.id}
                            className="hover:bg-gray-700 transition-colors cursor-pointer"
                            onClick={() => openUserModal(u)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{u.firstName} {u.lastName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-400">{u.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${u.role === 'developer' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${u.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{u.isActive !== false ? 'Active' : 'Inactive'}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={e => { e.stopPropagation(); openUserModal(u); }}
                                  className="text-blue-400 hover:text-blue-300"
                                  title="Edit User"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={e => { e.stopPropagation(); handleDeleteUser(u.id); }}
                                  className="text-red-400 hover:text-red-300"
                                  title="Delete User"
                                  disabled={savingUser}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Pagination */}
                {userPagination.totalPages > 1 && (
                  <div className="bg-gray-700 px-6 py-3 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Showing {((userPagination.currentPage - 1) * userFilters.limit) + 1} to {Math.min(userPagination.currentPage * userFilters.limit, userPagination.totalUsers)} of {userPagination.totalUsers} users
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUserFilterChange({ page: userPagination.currentPage - 1 })}
                        disabled={!userPagination.hasPrev}
                        className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-gray-300">
                        Page {userPagination.currentPage} of {userPagination.totalPages}
                      </span>
                      <button
                        onClick={() => handleUserFilterChange({ page: userPagination.currentPage + 1 })}
                        disabled={!userPagination.hasNext}
                        className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* User Modal */}
              {showUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-gray-800 rounded-xl max-w-lg w-full">
                    <form className="p-6 space-y-4" onSubmit={handleUserSubmit}>
                      <h3 className="text-xl font-bold text-white mb-2">{editingUser ? 'Edit User' : 'Add User'}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-400 mb-1">First Name</label>
                          <input type="text" className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={userForm.firstName} onChange={e => setUserForm(f => ({ ...f, firstName: e.target.value }))} required />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-1">Last Name</label>
                          <input type="text" className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={userForm.lastName} onChange={e => setUserForm(f => ({ ...f, lastName: e.target.value }))} required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Email</label>
                        <input type="email" className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Password {editingUser ? <span className="text-xs text-gray-400">(leave blank to keep unchanged)</span> : ''}</label>
                        <input type="password" className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={userForm.password} onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))} required={!editingUser} />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-1">Role</label>
                        <select className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none" value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}>
                          <option value="user">User</option>
                          <option value="developer">Developer</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="isActive" checked={userForm.isActive} onChange={e => setUserForm(f => ({ ...f, isActive: e.target.checked }))} className="mr-2" />
                        <label htmlFor="isActive" className="text-gray-400">Active</label>
                      </div>
                      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
                        <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
                        <button type="submit" disabled={savingUser} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          {savingUser ? (<><i className="fas fa-spinner fa-spin mr-2"></i>Saving...</>) : (<><i className="fas fa-save mr-2"></i>{editingUser ? 'Update User' : 'Create User'}</>)}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 