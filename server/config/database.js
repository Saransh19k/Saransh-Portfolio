require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

// Database configuration
const config = {
  sqlite: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database/development.db'),
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  }
};

// Create Sequelize instance for SQLite only
const sequelizeSqlite = new Sequelize(config.sqlite);

// Utility: Test database connection
const testConnection = async (sequelizeInstance) => {
  try {
    await sequelizeInstance.authenticate();
    console.log('\u2705 Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('\u274c Unable to connect to the database:', error.message);
    return false;
  }
};

// Utility: Sync database (create tables if they don't exist)
const syncDatabase = async (sequelizeInstance, force = false) => {
  try {
    await sequelizeInstance.sync({ force, alter: !force });
    console.log('\u2705 Database synchronized successfully.');
    return true;
  } catch (error) {
    console.error('\u274c Error synchronizing database:', error.message);
    return false;
  }
};

// For SQLite
const sqlite3 = require('sqlite3').verbose();
const dbSqlite = new sqlite3.Database('./server/database/development.db');

module.exports = {
  sequelizeSqlite,
  testConnection,
  syncDatabase,
  dbSqlite
}; 