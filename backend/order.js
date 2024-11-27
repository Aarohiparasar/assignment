const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
});

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  customerName: { type: String, required: true },
  orderAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], required: true },
  items: [itemSchema],
  createdAt: { type: Date, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
