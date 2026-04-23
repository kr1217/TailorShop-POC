const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { z } = require('zod');
const { Op } = require('sequelize');

// Zod Schema for validation
const customerSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Valid phone number required"),
    address: z.string().optional(),
    referralBy: z.string().optional(),
  }),
  measurements: z.object({
    male: z.any().optional(),
    female: z.any().optional(),
  }),
  orderDetails: z.object({
    quantity: z.number().default(1),
    totalPrice: z.string().optional(),
    dueDate: z.string().optional(),
    orderStatus: z.string().optional(),
    advancePayment: z.string().optional(),
    items: z.array(z.any()).optional(),
  }),
  orderHistory: z.array(z.any()).optional(),
}).passthrough();

// GET all customers for directory (with Pagination & Search)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const { rows: customers, count: total } = await Customer.findAndCountAll({
      where,
      order: [['updatedAt', 'DESC']],
      offset: skip,
      limit: limit
    });

    res.json({
      data: customers,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET customer by phone (search-as-you-type)
router.get('/:phone', async (req, res) => {
  try {
    const customer = await Customer.findOne({ where: { phone: req.params.phone } });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST upsert customer with Zod validation
router.post('/', async (req, res) => {
  try {
    // Validate request body
    const validatedData = customerSchema.parse(req.body);
    const phone = validatedData.personalInfo.phone;

    // Upsert logic in Sequelize
    // We use findOne and then update or create to ensure we get the full object back
    let customer = await Customer.findOne({ where: { phone } });
    
    if (customer) {
      await customer.update(validatedData);
    } else {
      customer = await Customer.create(validatedData);
    }

    res.status(201).json(customer);
  } catch (err) {
    if (err instanceof z.ZodError || err.name === 'ZodError') {
      console.error("ZOD VALIDATION ERROR:", JSON.stringify(err.issues || err.errors, null, 2));
      return res.status(400).json({ message: "Validation error", errors: err.issues || err.errors });
    }
    console.error("OTHER VALIDATION ERROR:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await customer.destroy();
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE customer (targeted ID update)
router.put('/:id', async (req, res) => {
  try {
    const { personalInfo } = req.body;
    const customer = await Customer.findByPk(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.update({ personalInfo });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
