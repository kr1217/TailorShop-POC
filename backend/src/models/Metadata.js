const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Metadata = sequelize.define('Metadata', {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  value: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'metadata'
});

module.exports = Metadata;
