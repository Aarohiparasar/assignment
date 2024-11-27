const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const Order = require('./order');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

// API Endpoint for Cursor-Based Pagination
app.get('/api/orders', async (req, res) => {
  const { cursor, limit = 50, sort = 'createdAt', sortDirection = 'asc' } = req.query;
  try {
    const query = cursor ? { createdAt: { $gt: new Date(cursor) } } : {};
    const sortOrder = sortDirection === 'asc' ? 1 : -1;

    const orders = await Order.find(query)
      .sort({ [sort]: sortOrder })
      .limit(Number(limit));

    const nextCursor = orders.length ? orders[orders.length - 1].createdAt : null;

    res.json({
      data: orders,
      nextCursor,
      totalCount: await Order.countDocuments(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(4000, () => console.log('Server running on port 3000'));
