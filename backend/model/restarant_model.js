const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }
});

const restaurantSchema = new mongoose.Schema({
  restaurantName: String,
  ownerName: String,
  state: String,
  city: String,
  street: String,
  pin: String,
  open: String,
  close: String,
  cuisines: [String],
  restaurant_mail: { type: String, unique: true },
  status: {
    type: String,
    default: function () {
      const currentHour = new Date().getHours();
      return currentHour < 9 || currentHour > 21 ? 'Closed' : 'Open'; // Default status based on time
    }
  },
  menus: [menuItemSchema],
  restaurantImage: { type: String }, // Ensure this matches your use case
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
