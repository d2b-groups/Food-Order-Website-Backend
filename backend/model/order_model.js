const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  restaurantEmail: { type: String, required: true },
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  customerEmail: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'pending' }, // Default status when order is created
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
