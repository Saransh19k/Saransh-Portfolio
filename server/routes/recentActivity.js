const express = require('express');
const router = express.Router();

const Contact = require('../models/Contact');
const Project = require('../models/Project');
const Blog = require('../models/Blog');

// Helper to format activity
function formatActivity(type, action, date) {
  return { type, action, date };
}

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    // Fetch latest 5 contacts
    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']],
      limit
    });
    // Fetch latest 5 projects
    const projects = await Project.findAll({
      order: [['updatedAt', 'DESC']],
      limit
    });
    // Fetch latest 5 blogs
    const blogs = await Blog.findAll({
      order: [['publishedAt', 'DESC']],
      limit
    });
    // Map to activity format
    const activities = [
      ...contacts.map(c => formatActivity('contact', `New contact form submission from ${c.name}`, c.createdAt)),
      ...projects.map(p => formatActivity('project', `Project "${p.title}" updated`, p.updatedAt)),
      ...blogs.map(b => formatActivity('blog', `Blog post "${b.title}" published`, b.publishedAt)),
    ];
    // Sort all by date desc, take top 'limit'
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recent = activities.slice(0, limit);
    res.json({ recent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

module.exports = router; 