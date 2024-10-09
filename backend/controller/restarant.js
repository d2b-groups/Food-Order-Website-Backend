// controllers/restaurantController.js
const Restaurant = require('../model/restarant_model'); // Import the Restaurant model
const jwtDecode = require('jwt-decode');

// Create or Update Restaurant
exports.createOrUpdateRestaurant = async (req, res) => {
  const {
    restaurantName,
    ownerName,
    state,
    city,
    street,
    pin,
    open,
    close,
    cuisines,
    restaurant_mail,
    menus
  } = req.body;

  const restaurantImage = req.file ? req.file.path : null; // Correct image path handling

  try {
    let restaurant;
    
    if (req.params.id) {
      restaurant = await Restaurant.findByIdAndUpdate(req.params.id, {
        restaurantName,
        ownerName,
        state,
        city,
        street,
        pin,
        open,
        close,
        cuisines,
        restaurant_mail,
        restaurantImage,
        menus
      }, { new: true });
    } else {
      restaurant = await Restaurant.create({
        restaurantName,
        ownerName,
        state,
        city,
        street,
        pin,
        open,
        close,
        cuisines,
        restaurant_mail,
        restaurantImage,
        menus
      });
    }

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch restaurant by email
exports.getRestaurantByEmail = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ restaurant_mail: req.params.email });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Add Menu Item
exports.addMenuItem = async (req, res) => {
  const { itemName, price } = req.body;
  const image = req.file ? req.file.filename : null;
  const email = req.query.email; // Get email from query parameters

  try {
    const restaurant = await Restaurant.findOne({ restaurant_mail: email });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menuItem = { itemName, price, image };
    restaurant.menus.push(menuItem);
    await restaurant.save();

    res.status(201).json({ menus: restaurant.menus });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit Menu Item
exports.editMenuItem = async (req, res) => {
  const { id } = req.params;
  const { itemName, price } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const restaurant = await Restaurant.findOne({ 'menus._id': id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const menuItem = restaurant.menus.id(id);
    menuItem.itemName = itemName;
    menuItem.price = price;
    if (image) {
      menuItem.image = image;
    }
    await restaurant.save();

    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete Menu Item
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findOne({ 'menus._id': id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    restaurant.menus.id(id).remove();
    await restaurant.save();

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Menu by Email
exports.getMenusByEmail = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ restaurant_mail: req.params.email });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ menus: restaurant.menus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Menu Items with Restaurant Name
exports.getAllMenuItems = async (req, res) => {
  try {
    // Find all restaurants and select necessary fields
    const restaurants = await Restaurant.find({}, 'restaurantName restaurant_mail menus');
    
    // Combine restaurant name with each menu item
    const allMenuItems = restaurants.flatMap((restaurant) => {
      console.log(restaurant); // Log the entire restaurant object
      
      return restaurant.menus.map(menu => ({
        restaurantName: restaurant.restaurantName,
        restaurantEmail: restaurant.restaurant_mail, // Now it should have value
        ...menu.toObject() // Flatten menu item data
      }));
    });

    // Respond with the combined menu items
    res.json(allMenuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Error fetching menu items" });
  }
};


// Get Restaurant and Menu by Menu Item ID and Email
exports.getRestaurantByMenuItemIdAndEmail = async (req, res) => {
  const { itemId, email } = req.params;

  try {
    // Find the restaurant by email and check if the menu item with the given ID exists
    const restaurant = await Restaurant.findOne({
      restaurant_mail: email,
      'menus._id': itemId
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant or menu item not found' });
    }

    // Find the specific menu item
    const menuItem = restaurant.menus.id(itemId);

    // Respond with restaurant and menu item details
    res.status(200).json({
      restaurantName: restaurant.restaurantName,
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
