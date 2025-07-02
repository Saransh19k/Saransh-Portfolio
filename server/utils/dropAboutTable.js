const { sequelize } = require('../config/database');

async function dropAboutTable() {
  try {
    await sequelize.getQueryInterface().dropTable('Abouts');
    console.log('✅ About table dropped successfully.');
  } catch (err) {
    console.error('❌ Failed to drop About table:', err);
  } finally {
    await sequelize.close();
  }
}

dropAboutTable(); 