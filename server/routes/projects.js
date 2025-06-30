const express = require('express');
const router = express.Router();

// Sample projects data (in production, use database)
let projects = [
  // No default projects. Add your own projects here.
];

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, sort = 'completedAt' } = req.query;
    
    let filteredProjects = [...projects];
    
    // Filter by category
    if (category) {
      filteredProjects = filteredProjects.filter(project => 
        project.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by featured
    if (featured === 'true') {
      filteredProjects = filteredProjects.filter(project => project.featured);
    }
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = filteredProjects.filter(project =>
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
      );
    }
    
    // Sorting
    filteredProjects.sort((a, b) => {
      switch (sort) {
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'completedAt':
        default:
          return new Date(b.completedAt) - new Date(a.completedAt);
      }
    });
    
    res.json({
      success: true,
      data: filteredProjects
    });
    
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = projects.find(p => p.id === parseInt(id));
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Increment views
    project.views++;
    
    res.json({
      success: true,
      data: project
    });
    
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// Create new project (admin only)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      technologies,
      category,
      liveUrl,
      githubUrl,
      featured = false
    } = req.body;
    
    const newProject = {
      id: projects.length + 1,
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
      completedAt: new Date().toISOString().split('T')[0]
    };
    
    projects.push(newProject);
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject
    });
    
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

// Update project (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const projectIndex = projects.findIndex(p => p.id === parseInt(id));
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updateData
    };
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      data: projects[projectIndex]
    });
    
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// Delete project (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const projectIndex = projects.findIndex(p => p.id === parseInt(id));
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    const deletedProject = projects.splice(projectIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: deletedProject
    });
    
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

// Like project
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const project = projects.find(p => p.id === parseInt(id));
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    project.likes++;
    
    res.json({
      success: true,
      message: 'Project liked successfully',
      data: { likes: project.likes }
    });
    
  } catch (error) {
    console.error('Like project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like project'
    });
  }
});

// Get project categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [...new Set(projects.map(project => project.category))];
    
    res.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Get project statistics
router.get('/stats/overview', async (req, res) => {
  try {
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
      project.technologies.forEach(tech => {
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
        averageViews: Math.round(totalViews / totalProjects),
        averageLikes: Math.round(totalLikes / totalProjects),
        categoryStats,
        topTechnologies: topTech
      }
    });
    
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project statistics'
    });
  }
});

module.exports = router; 