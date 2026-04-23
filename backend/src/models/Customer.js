const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  // We extract name and phone to top-level columns for indexing and searching
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  personalInfo: {
    type: DataTypes.JSON,
    allowNull: false
  },
  measurements: {
    type: DataTypes.JSON,
    allowNull: true
  },
  orderDetails: {
    type: DataTypes.JSON,
    allowNull: true
  },
  orderHistory: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  timestamps: true,
  tableName: 'customers',
  indexes: [
    { fields: ['phone'] },
    { fields: ['name'] }
  ]
});

// Hooks to ensure name and phone are synced with personalInfo
Customer.beforeValidate((customer) => {
  if (customer.personalInfo) {
    if (customer.personalInfo.name) customer.name = customer.personalInfo.name;
    if (customer.personalInfo.phone) customer.phone = customer.personalInfo.phone;
  }
});

module.exports = Customer;
