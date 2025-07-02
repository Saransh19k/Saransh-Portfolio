const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { validateBlogPost } = require('../middleware/validation');

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, status } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    // Add status filter - if not specified, default to published for public access
    if (status && status !== 'all') {
      whereClause.status = status;
    } else {
      // Default to published posts for public access
      whereClause.status = 'published';
    }
    
    // Add category filter
    if (category && category !== 'all') {
      whereClause.category = category;
    }
    
    // Add search filter
    if (search) {
      whereClause = {
        ...whereClause,
        [Blog.sequelize.Op.or]: [
          { title: { [Blog.sequelize.Op.like]: `%${search}%` } },
          { excerpt: { [Blog.sequelize.Op.like]: `%${search}%` } },
          { content: { [Blog.sequelize.Op.like]: `%${search}%` } }
        ]
      };
    }
    
    const { count, rows: posts } = await Blog.findAndCountAll({
      where: whereClause,
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    // Transform posts to match frontend expectations
    const transformedPosts = posts.map(post => ({
      id: post.id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      tags: post.tags,
      category: post.category,
      author: {
        name: post.authorName,
        avatar: post.authorAvatar
      },
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      views: post.views,
      likes: post.likes,
      status: post.status
    }));
    
    res.json({
      success: true,
      data: {
        posts: transformedPosts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalPosts: count,
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts'
    });
  }
});

// Get a single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await Blog.findBySlug(slug);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Increment view count
    await post.incrementViews();
    
    // Transform post to match frontend expectations
    const transformedPost = {
      id: post.id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      tags: post.tags,
      category: post.category,
      author: {
        name: post.authorName,
        avatar: post.authorAvatar
      },
      publishedAt: post.publishedAt,
      readTime: post.readTime,
      views: post.views + 1, // Include the incremented view
      likes: post.likes
    };
    
    res.json({
      success: true,
      data: {
        post: transformedPost
      }
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post'
    });
  }
});

// Like a blog post
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Blog.findByPk(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    await post.incrementLikes();
    
    res.json({
      success: true,
      data: {
        likes: post.likes + 1
      }
    });
  } catch (error) {
    console.error('Error liking blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like blog post'
    });
  }
});

// Create a new blog post (admin only)
router.post('/', validateBlogPost, async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      tags,
      category,
      authorName,
      authorAvatar,
      readTime,
      status
    } = req.body;
    
    // Check if slug already exists
    const existingPost = await Blog.findOne({ where: { slug } });
    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: 'A blog post with this slug already exists'
      });
    }
    
    const post = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      tags,
      category,
      authorName,
      authorAvatar,
      readTime: readTime || 5,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null
    });
    
    res.status(201).json({
      success: true,
      data: {
        post: {
          id: post.id.toString(),
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featuredImage: post.featuredImage,
          tags: post.tags,
          category: post.category,
          author: {
            name: post.authorName,
            avatar: post.authorAvatar
          },
          publishedAt: post.publishedAt,
          readTime: post.readTime,
          views: post.views,
          likes: post.likes,
          status: post.status
        }
      }
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post'
    });
  }
});

// Update a blog post (admin only)
router.put('/:id', validateBlogPost, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const post = await Blog.findByPk(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Handle publishedAt date based on status
    if (updateData.status === 'published' && post.status !== 'published') {
      updateData.publishedAt = new Date();
    } else if (updateData.status !== 'published') {
      updateData.publishedAt = null;
    }
    
    await post.update(updateData);
    
    res.json({
      success: true,
      data: {
        post: {
          id: post.id.toString(),
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featuredImage: post.featuredImage,
          tags: post.tags,
          category: post.category,
          author: {
            name: post.authorName,
            avatar: post.authorAvatar
          },
          publishedAt: post.publishedAt,
          readTime: post.readTime,
          views: post.views,
          likes: post.likes,
          status: post.status
        }
      }
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post'
    });
  }
});

// Delete a blog post (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Blog.findByPk(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    await post.destroy();
    
    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post'
    });
  }
});

// Get blog categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Blog.distinct('category', { status: 'published' });
    
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

// Get blog tags
router.get('/tags/list', async (req, res) => {
  try {
    const tags = await Blog.distinct('tags', { status: 'published' });
    
    res.json({
      success: true,
      data: tags
    });
    
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags'
    });
  }
});

module.exports = router; 