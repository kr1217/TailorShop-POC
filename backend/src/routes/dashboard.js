const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const sequelize = require('../utils/db');
const { Op } = require('sequelize');

// ── Auth Endpoint ─────────────────────────────────────────────────────────
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  const validUser = process.env.ADMIN_USER || 'admin';
  const validPass = process.env.ADMIN_PASS || 'admin123';

  if (username === validUser && password === validPass) {
    return res.json({ success: true, token: 'mock-jwt-token-tailor-poc' });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// ── Stats Endpoint ────────────────────────────────────────────────────────
router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalCustomers = await Customer.count();
    
    // Active orders: Status is Pending or In-Progress
    const activeOrders = await Customer.count({
      where: sequelize.where(
        sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('orderDetails'), '$.orderStatus')),
        { [Op.in]: ['Pending', 'In-Progress'] }
      )
    });

    // Sum revenue — safely handle null/undefined totalPrice
    const customers = await Customer.findAll({ attributes: ['orderDetails'] });
    const totalRevenue = customers.reduce((sum, c) => {
      const raw = c.orderDetails?.totalPrice;
      if (!raw) return sum;
      const price = parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 0;
      return sum + price;
    }, 0);

    res.json({ totalCustomers, activeOrders, totalRevenue });
  } catch (err) {
    console.error('Stats Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Alerts Endpoint ───────────────────────────────────────────────────────
router.get('/dashboard/alerts', async (req, res) => {
  try {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const threeDays = new Date();
    threeDays.setDate(now.getDate() + 3);

    const [urgent, warning, info] = await Promise.all([
      Customer.findAll({
        where: {
          [Op.and]: [
            sequelize.where(sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('orderDetails'), '$.dueDate')), { [Op.lte]: now }),
            sequelize.where(sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('orderDetails'), '$.orderStatus')), { [Op.ne]: 'Delivered' })
          ]
        },
        attributes: ['id', 'name', 'personalInfo', 'orderDetails']
      }),

      Customer.findAll({
        where: {
          [Op.and]: [
            sequelize.where(sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('orderDetails'), '$.dueDate')), { [Op.gt]: now, [Op.lte]: tomorrow }),
            sequelize.where(sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('orderDetails'), '$.orderStatus')), { [Op.ne]: 'Delivered' })
          ]
        },
        attributes: ['id', 'name', 'personalInfo', 'orderDetails']
      }),

      Customer.findAll({
        where: {
          [Op.and]: [
            sequelize.where(sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('orderDetails'), '$.dueDate')), { [Op.gt]: tomorrow, [Op.lte]: threeDays }),
            sequelize.where(sequelize.fn('JSON_UNQUOTE', sequelize.fn('JSON_EXTRACT', sequelize.col('orderDetails'), '$.orderStatus')), { [Op.ne]: 'Delivered' })
          ]
        },
        attributes: ['id', 'name', 'personalInfo', 'orderDetails']
      }),
    ]);

    res.json({ urgent, warning, info });
  } catch (err) {
    console.error('Alerts Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
