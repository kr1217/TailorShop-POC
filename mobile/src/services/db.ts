import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import { FormInputs } from '../types/customer';

const DB_NAME = 'alriaz_tailors.db';

export const db = SQLite.openDatabaseSync(DB_NAME);

export const initDB = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      address TEXT,
      referralBy TEXT,
      measurements TEXT, -- Stored as JSON string
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId INTEGER,
      quantity INTEGER DEFAULT 1,
      items TEXT, -- Stored as JSON string
      totalPrice TEXT,
      advancePayment TEXT DEFAULT '0',
      dueDate TEXT,
      orderStatus TEXT DEFAULT 'Pending',
      paymentStatus INTEGER DEFAULT 0, -- 0 for false, 1 for true
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
    );
  `);
  console.log('Database initialized');
};

export const databaseApi = {
  getCustomers: async (page = 1, limit = 50, search = '') => {
    const offset = (page - 1) * limit;
    const query = search 
      ? `SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? ORDER BY updatedAt DESC LIMIT ? OFFSET ?`
      : `SELECT * FROM customers ORDER BY updatedAt DESC LIMIT ? OFFSET ?`;
    
    const params = search 
      ? [`%${search}%`, `%${search}%`, limit, offset]
      : [limit, offset];

    const rows = await db.getAllAsync(query, params);
    
    // Also get total count for pagination
    const countQuery = search
      ? `SELECT COUNT(*) as count FROM customers WHERE name LIKE ? OR phone LIKE ?`
      : `SELECT COUNT(*) as count FROM customers`;
    const countParams = search ? [`%${search}%`, `%${search}%`] : [];
    const countResult = await db.getFirstAsync<{ count: number }>(countQuery, countParams);

    return {
      customers: rows.map((row: any) => ({
        ...row,
        measurements: JSON.parse(row.measurements || '{}')
      })),
      total: countResult?.count || 0
    };
  },

  getCustomerById: async (id: number) => {
    const row = await db.getFirstAsync<any>(`SELECT * FROM customers WHERE id = ?`, [id]);
    if (!row) return null;
    
    const order = await db.getFirstAsync<any>(`SELECT * FROM orders WHERE customerId = ? ORDER BY createdAt DESC LIMIT 1`, [id]);

    return {
      personalInfo: {
        name: row.name,
        phone: row.phone,
        address: row.address,
        referralBy: row.referralBy
      },
      measurements: JSON.parse(row.measurements || '{}'),
      orderDetails: order ? {
        ...order,
        items: JSON.parse(order.items || '[]'),
        paymentStatus: order.paymentStatus === 1
      } : undefined
    };
  },

  getCustomerByPhone: async (phone: string) => {
    const row = await db.getFirstAsync<any>(`SELECT * FROM customers WHERE phone = ?`, [phone]);
    if (!row) return null;
    return databaseApi.getCustomerById(row.id);
  },

  saveCustomer: async (data: FormInputs, customerId?: number) => {
    const { personalInfo, measurements, orderDetails } = data;
    
    let targetCustomerId = customerId;

    if (targetCustomerId) {
      // Update existing customer
      await db.runAsync(
        `UPDATE customers SET name = ?, phone = ?, address = ?, referralBy = ?, measurements = ?, updatedAt = datetime('now') WHERE id = ?`,
        [personalInfo.name, personalInfo.phone, personalInfo.address, personalInfo.referralBy, JSON.stringify(measurements), targetCustomerId]
      );
    } else {
      // Check for phone duplicate first
      const existing = await db.getFirstAsync<{ id: number }>(`SELECT id FROM customers WHERE phone = ?`, [personalInfo.phone]);
      if (existing) {
        targetCustomerId = existing.id;
        await db.runAsync(
          `UPDATE customers SET name = ?, address = ?, referralBy = ?, measurements = ?, updatedAt = datetime('now') WHERE id = ?`,
          [personalInfo.name, personalInfo.address, personalInfo.referralBy, JSON.stringify(measurements), targetCustomerId]
        );
      } else {
        const result = await db.runAsync(
          `INSERT INTO customers (name, phone, address, referralBy, measurements) VALUES (?, ?, ?, ?, ?)`,
          [personalInfo.name, personalInfo.phone, personalInfo.address, personalInfo.referralBy, JSON.stringify(measurements)]
        );
        targetCustomerId = result.lastInsertRowId;
      }
    }

    // Handle Order: If customer exists, check for latest order to UPDATE instead of INSERT
    const latestOrder = await db.getFirstAsync<{ id: number }>(`SELECT id FROM orders WHERE customerId = ? ORDER BY createdAt DESC LIMIT 1`, [targetCustomerId]);

    if (latestOrder) {
      await db.runAsync(
        `UPDATE orders SET quantity = ?, items = ?, totalPrice = ?, advancePayment = ?, dueDate = ?, orderStatus = ?, paymentStatus = ?, updatedAt = datetime('now') WHERE id = ?`,
        [
          orderDetails.quantity, 
          JSON.stringify(orderDetails.items), 
          orderDetails.totalPrice, 
          orderDetails.advancePayment, 
          orderDetails.dueDate, 
          orderDetails.orderStatus, 
          orderDetails.paymentStatus ? 1 : 0,
          latestOrder.id
        ]
      );
    } else {
      await db.runAsync(
        `INSERT INTO orders (customerId, quantity, items, totalPrice, advancePayment, dueDate, orderStatus, paymentStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          targetCustomerId, 
          orderDetails.quantity, 
          JSON.stringify(orderDetails.items), 
          orderDetails.totalPrice, 
          orderDetails.advancePayment, 
          orderDetails.dueDate, 
          orderDetails.orderStatus, 
          orderDetails.paymentStatus ? 1 : 0
        ]
      );
    }

    return { success: true };
  },

  deleteCustomer: async (id: number) => {
    await db.runAsync(`DELETE FROM customers WHERE id = ?`, [id]);
    return { success: true };
  },

  getStats: async () => {
    const customerCount = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM customers`);
    const activeOrders = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM orders WHERE orderStatus != 'Completed'`);
    const totalRevenue = await db.getFirstAsync<{ sum: number }>(`SELECT SUM(CAST(totalPrice AS REAL)) as sum FROM orders`);
    
    return {
      totalCustomers: customerCount?.count || 0,
      activeOrders: activeOrders?.count || 0,
      totalRevenue: totalRevenue?.sum || 0
    };
  },

  getAlerts: async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Urgent: Overdue orders
    const urgent = await db.getAllAsync(
      `SELECT o.*, c.name, c.phone FROM orders o JOIN customers c ON o.customerId = c.id WHERE o.dueDate < ? AND o.orderStatus != 'Completed'`,
      [today]
    );

    // Warning: Due today or tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const warning = await db.getAllAsync(
      `SELECT o.*, c.name, c.phone FROM orders o JOIN customers c ON o.customerId = c.id WHERE o.dueDate BETWEEN ? AND ? AND o.orderStatus != 'Completed'`,
      [today, tomorrowStr]
    );

    return {
      urgent: urgent.map((u: any) => ({ ...u, personalInfo: { name: u.name, phone: u.phone } })),
      warning: warning.map((w: any) => ({ ...w, personalInfo: { name: w.name, phone: w.phone } }))
    };
  },

  backupDB: async () => {
    const docDir = FileSystem.documentDirectory;
    const base = docDir?.endsWith('/') ? docDir : `${docDir}/`;
    
    const possiblePaths = [
      `${base}SQLite/${DB_NAME}`,
      `${base}${DB_NAME}`,
      `${base}../databases/${DB_NAME}`,
    ];

    let sourceUri = '';
    for (const p of possiblePaths) {
      try {
        const info = await FileSystem.getInfoAsync(p);
        if (info.exists) {
          sourceUri = p;
          break;
        }
      } catch (e) {}
    }

    if (!sourceUri) {
      throw new Error("Could not find the database file. Please try to save a customer first.");
    }

    const targetUri = `${FileSystem.cacheDirectory}tailor_backup_${Date.now()}.db`;
    
    await FileSystem.copyAsync({
      from: sourceUri,
      to: targetUri
    });
    
    return targetUri;
  },

  restoreDB: async (backupUri: string) => {
    const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
    const targetUri = dbPath.startsWith('file://') ? dbPath : `file://${dbPath}`;
    const sourceUri = backupUri.startsWith('file://') ? backupUri : `file://${backupUri}`;

    console.log("Restoring from:", sourceUri, "to:", targetUri);
    
    await db.closeAsync();
    await FileSystem.copyAsync({
      from: sourceUri,
      to: targetUri
    });
    return true;
  }
};
