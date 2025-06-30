const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  featuredImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  tags: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value));
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'General',
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  authorName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'Saransh Nimje',
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  authorAvatar: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  readTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 60
    }
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'draft'
  }
}, {
  tableName: 'blogs',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['category']
    },
    {
      fields: ['status']
    },
    {
      fields: ['published_at']
    }
  ]
});

// Instance methods
Blog.prototype.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

Blog.prototype.incrementLikes = async function() {
  this.likes += 1;
  return await this.save();
};

// Class methods
Blog.findBySlug = async function(slug) {
  return await this.findOne({
    where: { 
      slug,
      status: 'published'
    }
  });
};

Blog.findPublished = async function(options = {}) {
  return await this.findAll({
    where: { status: 'published' },
    order: [['publishedAt', 'DESC']],
    ...options
  });
};

Blog.findByCategory = async function(category, options = {}) {
  return await this.findAll({
    where: { 
      category,
      status: 'published'
    },
    order: [['publishedAt', 'DESC']],
    ...options
  });
};

module.exports = Blog; 