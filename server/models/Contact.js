const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
      len: [1, 255]
    }
  },
  subject: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 200]
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 5000]
    }
  },
  status: {
    type: DataTypes.ENUM('new', 'read', 'replied', 'archived'),
    allowNull: false,
    defaultValue: 'new'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  repliedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  replyMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'contacts',
  timestamps: true,
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['email']
    }
  ]
});

// Instance methods
Contact.prototype.markAsRead = async function() {
  this.status = 'read';
  return await this.save();
};

Contact.prototype.markAsReplied = async function(replyMessage = null) {
  this.status = 'replied';
  this.repliedAt = new Date();
  if (replyMessage) {
    this.replyMessage = replyMessage;
  }
  return await this.save();
};

Contact.prototype.archive = async function() {
  this.status = 'archived';
  return await this.save();
};

// Class methods
Contact.findNew = async function(options = {}) {
  return await this.findAll({
    where: { status: 'new' },
    order: [['createdAt', 'DESC']],
    ...options
  });
};

Contact.findByStatus = async function(status, options = {}) {
  return await this.findAll({
    where: { status },
    order: [['createdAt', 'DESC']],
    ...options
  });
};

Contact.getStats = async function() {
  const stats = await this.findAll({
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['status']
  });
  
  return stats.reduce((acc, stat) => {
    acc[stat.status] = parseInt(stat.dataValues.count);
    return acc;
  }, {});
};

module.exports = Contact; 