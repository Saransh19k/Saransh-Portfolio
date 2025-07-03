const express = require('express');
const router = express.Router();
const { Project } = require('../models');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, sort = 'completedAt' } = req.query;
    let where = {};
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;
    if (search) {
      where = {
        ...where,
        [Project.sequelize.Op.or]: [
          { title: { [Project.sequelize.Op.like]: `%${search}%` } },
          { description: { [Project.sequelize.Op.like]: `%${search}%` } },
          { technologies: { [Project.sequelize.Op.like]: `%${search}%` } }
        ]
      };
    }
    const projects = await Project.findAll({ where, order: [[sort, 'DESC']] });
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    // Increment views
    project.views++;
    await project.save();
    res.json({ success: true, data: project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
});

// Create new project (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, description, image, technologies, category, liveUrl, githubUrl, featured = false } = req.body;
    const newProject = await Project.create({
      title,
      description,
      image,
      technologies,
      category,
      liveUrl,
      githubUrl,
      featured,
      views: 0,
      likes: 0,
      completedAt: new Date()
    });
    res.status(201).json({ success: true, message: 'Project created successfully', data: newProject });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Failed to create project' });
  }
});

// Update project (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    await project.update(updateData);
    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project' });
  }
});

// Delete project (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    await project.destroy();
    res.json({ success: true, message: 'Project deleted successfully', data: project });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
});

// Like project
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.likes++;
    await project.save();
    res.json({ success: true, message: 'Project liked successfully', data: { likes: project.likes } });
  } catch (error) {
    console.error('Like project error:', error);
    res.status(500).json({ success: false, message: 'Failed to like project' });
  }
});

// Get project categories
router.get('/categories/list', async (req, res) => {
  try {
    const projects = await Project.findAll({ attributes: ['category'] });
    const categories = [...new Set(projects.map(project => project.category))];
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Get project statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const projects = await Project.findAll();
    const totalProjects = projects.length;
    const featuredProjects = projects.filter(p => p.featured).length;
    const totalViews = projects.reduce((sum, p) => sum + p.views, 0);
    const totalLikes = projects.reduce((sum, p) => sum + p.likes, 0);
    const categoryStats = {};
    projects.forEach(project => {
      if (!categoryStats[project.category]) {
        categoryStats[project.category] = 0;
      }
      categoryStats[project.category]++;
    });
    const topTechnologies = {};
    projects.forEach(project => {
      (project.technologies || []).forEach(tech => {
        if (!topTechnologies[tech]) {
          topTechnologies[tech] = 0;
        }
        topTechnologies[tech]++;
      });
    });
    const topTech = Object.entries(topTechnologies)
      .map(([tech, count]) => ({ tech, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    res.json({
      success: true,
      data: {
        totalProjects,
        featuredProjects,
        totalViews,
        totalLikes,
        averageViews: totalProjects ? Math.round(totalViews / totalProjects) : 0,
        averageLikes: totalProjects ? Math.round(totalLikes / totalProjects) : 0,
        categoryStats,
        topTechnologies: topTech
      }
    });
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project statistics' });
  }
});

module.exports = router; 