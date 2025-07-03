const { sequelizeSqlite: sequelize } = require('../config/database');
const Contact = require('./Contact')(sequelize);
const Blog = require('./Blog')(sequelize);
const User = require('./User')(sequelize);
const Project = require('./Project')(sequelize);

module.exports = { Contact, Blog, User, Project, sequelize }; 