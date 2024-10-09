const express = require('express');
const router = express.Router();
const Order = require('../model/order_model'); // Make sure this model exists and is correctly defined

// Create an order
router.post('/create-order', async (req, res) => {
  const orderData = req.body;

  try {
    const newOrder = new Order(orderData);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get orders for a specific customer
router.get('/get-orders', async (req, res) => {
  const { customerEmail } = req.query; // Correctly retrieve customerEmail from query params
console.log(customerEmail);

  try {
    const orders = await Order.find({ customerEmail }).sort({ createdAt: -1 }); // Sort by latest orders
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status
router.put('/status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
});

// Get orders for a specific restaurant
router.get('/get-orders/restaurant', async (req, res) => {
    const { restaurantEmail } = req.query;
  
    if (!restaurantEmail) {
      return res.status(400).json({ message: 'Restaurant email is required' });
    }
  
    try {
      const orders = await Order.find({ restaurantEmail }).sort({ createdAt: -1 });
      if (orders.length === 0) {
        return res.status(404).json({ message: `No orders found for restaurant email: ${restaurantEmail}` });
      }
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  });
  
  

module.exports = router;
