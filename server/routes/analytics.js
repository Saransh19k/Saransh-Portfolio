const express = require('express');
const router = express.Router();
const { Blog, Contact, Project } = require('../models');

// In-memory storage for analytics (in production, use Redis or database)
let analytics = {
  visitors: 0,
  pageViews: 0,
  uniqueVisitors: new Set(),
  pageViewsHistory: [],
  visitorStats: {
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  }
};

// Track page view
router.post('/track', async (req, res) => {
  try {
    const { page, referrer, userAgent, screenResolution, timezone } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const timestamp = new Date();
    
    // Increment page views
    analytics.pageViews++;
    
    // Track unique visitors
    if (!analytics.uniqueVisitors.has(ipAddress)) {
      analytics.visitors++;
      analytics.uniqueVisitors.add(ipAddress);
    }
    
    // Add to page views history
    analytics.pageViewsHistory.push({
      page,
      ipAddress,
      userAgent,
      referrer,
      screenResolution,
      timezone,
      timestamp
    });
    
    // Keep only last 1000 entries
    if (analytics.pageViewsHistory.length > 1000) {
      analytics.pageViewsHistory = analytics.pageViewsHistory.slice(-1000);
    }
    
    res.json({
      success: true,
      message: 'Page view tracked successfully'
    });
    
  } catch (error) {
    console.error('Track page view error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track page view'
    });
  }
});

// Get analytics overview
router.get('/overview', async (req, res) => {
  try {
    const overview = {
      totalVisitors: analytics.visitors,
      totalPageViews: analytics.pageViews,
      uniqueVisitors: analytics.uniqueVisitors.size,
      averagePageViewsPerVisitor: analytics.uniqueVisitors.size > 0 
        ? (analytics.pageViews / analytics.uniqueVisitors.size).toFixed(2) 
        : 0
    };
    
    res.json({
      success: true,
      data: overview
    });
    
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics overview'
    });
  }
});

// Get page views by page
router.get('/pages', async (req, res) => {
  try {
    const pageStats = {};
    
    analytics.pageViewsHistory.forEach(view => {
      if (!pageStats[view.page]) {
        pageStats[view.page] = 0;
      }
      pageStats[view.page]++;
    });
    
    const pages = Object.entries(pageStats).map(([page, views]) => ({
      page,
      views,
      percentage: ((views / analytics.pageViews) * 100).toFixed(2)
    })).sort((a, b) => b.views - a.views);
    
    res.json({
      success: true,
      data: pages
    });
    
  } catch (error) {
    console.error('Get page stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page statistics'
    });
  }
});

// Get referrer statistics
router.get('/referrers', async (req, res) => {
  try {
    const referrerStats = {};
    
    analytics.pageViewsHistory.forEach(view => {
      const referrer = view.referrer || 'Direct';
      if (!referrerStats[referrer]) {
        referrerStats[referrer] = 0;
      }
      referrerStats[referrer]++;
    });
    
    const referrers = Object.entries(referrerStats).map(([referrer, count]) => ({
      referrer,
      count,
      percentage: ((count / analytics.pageViews) * 100).toFixed(2)
    })).sort((a, b) => b.count - a.count);
    
    res.json({
      success: true,
      data: referrers
    });
    
  } catch (error) {
    console.error('Get referrer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch referrer statistics'
    });
  }
});

// Get hourly/daily traffic patterns
router.get('/traffic-patterns', async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    
    const patterns = {};
    
    analytics.pageViewsHistory.forEach(view => {
      const date = new Date(view.timestamp);
      let key;
      
      if (period === 'hourly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      
      if (!patterns[key]) {
        patterns[key] = 0;
      }
      patterns[key]++;
    });
    
    const sortedPatterns = Object.entries(patterns)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => new Date(a.time) - new Date(b.time));
    
    res.json({
      success: true,
      data: sortedPatterns
    });
    
  } catch (error) {
    console.error('Get traffic patterns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch traffic patterns'
    });
  }
});

// Get device/browser statistics
router.get('/devices', async (req, res) => {
  try {
    const deviceStats = {
      browsers: {},
      screenResolutions: {},
      timezones: {}
    };
    
    analytics.pageViewsHistory.forEach(view => {
      // Browser detection (simplified)
      let browser = 'Unknown';
      if (view.userAgent.includes('Chrome')) browser = 'Chrome';
      else if (view.userAgent.includes('Firefox')) browser = 'Firefox';
      else if (view.userAgent.includes('Safari')) browser = 'Safari';
      else if (view.userAgent.includes('Edge')) browser = 'Edge';
      
      if (!deviceStats.browsers[browser]) {
        deviceStats.browsers[browser] = 0;
      }
      deviceStats.browsers[browser]++;
      
      // Screen resolution
      if (view.screenResolution) {
        if (!deviceStats.screenResolutions[view.screenResolution]) {
          deviceStats.screenResolutions[view.screenResolution] = 0;
        }
        deviceStats.screenResolutions[view.screenResolution]++;
      }
      
      // Timezone
      if (view.timezone) {
        if (!deviceStats.timezones[view.timezone]) {
          deviceStats.timezones[view.timezone] = 0;
        }
        deviceStats.timezones[view.timezone]++;
      }
    });
    
    // Convert to arrays and sort
    const browsers = Object.entries(deviceStats.browsers)
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count);
    
    const screenResolutions = Object.entries(deviceStats.screenResolutions)
      .map(([resolution, count]) => ({ resolution, count }))
      .sort((a, b) => b.count - a.count);
    
    const timezones = Object.entries(deviceStats.timezones)
      .map(([timezone, count]) => ({ timezone, count }))
      .sort((a, b) => b.count - a.count);
    
    res.json({
      success: true,
      data: {
        browsers,
        screenResolutions,
        timezones
      }
    });
    
  } catch (error) {
    console.error('Get device stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch device statistics'
    });
  }
});

// Reset analytics (admin only)
router.delete('/reset', async (req, res) => {
  try {
    analytics = {
      visitors: 0,
      pageViews: 0,
      uniqueVisitors: new Set(),
      pageViewsHistory: [],
      visitorStats: {
        today: 0,
        thisWeek: 0,
        thisMonth: 0
      }
    };
    
    res.json({
      success: true,
      message: 'Analytics reset successfully'
    });
    
  } catch (error) {
    console.error('Reset analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset analytics'
    });
  }
});

// Admin stats endpoint
router.get('/admin/stats', async (req, res) => {
  try {
    const totalBlogPosts = await Blog.count();
    const totalContacts = await Contact.count();
    const totalProjects = await Project.count();
    res.json({
      success: true,
      data: {
        totalVisitors: analytics.visitors,
        totalProjects,
        totalBlogPosts,
        totalContacts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

module.exports = router; 