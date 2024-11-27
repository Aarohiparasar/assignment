const mongoose = require('mongoose');
const Order = require('./order');
const { v4: uuidv4 } = require('uuid');

const statuses = ['pending', 'processing', 'completed', 'cancelled'];

const generateOrders = () => {
  const orders = [];
  for (let i = 0; i < 10000; i++) {
    orders.push({
      id: uuidv4(),
      customerName: `Customer-${Math.floor(Math.random() * 1000)}`,
      orderAmount: parseFloat((Math.random() * 1000).toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
        name: `Item-${Math.floor(Math.random() * 100)}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        price: parseFloat((Math.random() * 100).toFixed(2)),
      })),
      createdAt: new Date(Date.now() - Math.random() * 1e11),
    });
  }
  return orders;
};

const seedData = async () => {
  try {
    await mongoose.connect("mongodb+srv://aarohisingh:aarohi123@cluster0.rd1lz.mongodb.net/assignment");
    await Order.deleteMany();
    const orders = generateOrders();
    await Order.insertMany(orders);
    console.log('Seeding complete');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error.message);
    mongoose.connection.close();
  }
};

seedData();
