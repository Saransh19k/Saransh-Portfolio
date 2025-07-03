const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255],
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'developer'),
      defaultValue: 'user',
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    loginCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    emailVerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    timezone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['role']
      },
      {
        fields: ['created_at']
      }
    ],
    hooks: {
      beforeCreate: async (user) => {
        // Hash password before saving
        if (user.password) {
          const saltRounds = 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
        // Set default preferences
        if (!user.preferences) {
          user.preferences = {
            theme: 'dark',
            notifications: {
              email: true,
              push: false
            },
            privacy: {
              profileVisible: true,
              showEmail: false
            }
          };
        }
      },
      beforeUpdate: async (user) => {
        // Hash password if it's being updated
        if (user.changed('password')) {
          const saltRounds = 12;
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      }
    }
  });

  // Instance methods
  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  User.prototype.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    delete values.emailVerificationToken;
    delete values.passwordResetToken;
    return values;
  };

  User.prototype.updateLoginInfo = async function(ipAddress, userAgent) {
    this.lastLoginAt = new Date();
    this.loginCount += 1;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    return await this.save();
  };

  // Class methods
  User.findByEmail = async function(email) {
    return await this.findOne({
      where: { email: email.toLowerCase() }
    });
  };

  User.createUser = async function(userData) {
    const { firstName, lastName, email, password, role = 'user' } = userData;
    
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    return await this.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role
    });
  };

  User.authenticate = async function(email, password) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return null;
    }
    
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }
    
    return user;
  };

  User.authenticateAdmin = async function(email, password, adminKey) {
    const user = await this.authenticate(email, password);
    
    if (!user) {
      return null;
    }
    
    if (user.role !== 'developer') {
      throw new Error('Access denied. Developer role required.');
    }
    
    // In production, this should be a secure admin key validation
    if (adminKey !== 'developer2024') {
      throw new Error('Invalid admin key');
    }
    
    return user;
  };

  return User;
}; 