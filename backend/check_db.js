require('dotenv').config();
const sequelize = require('./src/utils/db');
const Customer = require('./src/models/Customer');

async function checkDb() {
  try {
    console.log('Connecting to MySQL...');
    await sequelize.authenticate();
    console.log('Connected.');
    
    await sequelize.sync();
    
    const count = await Customer.count();
    console.log('Total customers in DB:', count);
    
    const customers = await Customer.findAll({ limit: 5 });
    console.log('Sample customers:', JSON.stringify(customers, null, 2));
    
    await sequelize.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkDb();
