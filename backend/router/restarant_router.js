const express = require('express');
const multer = require('multer');
const {
  createOrUpdateRestaurant,
  getRestaurantByEmail,
  deleteRestaurant,
  getAllRestaurants,
  addMenuItem,
  editMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getRestaurantByMenuItemIdAndEmail
} = require('../controller/restarant'); // Corrected controller path

const router = express.Router();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.post('/add', upload.single('restaurantImage'), createOrUpdateRestaurant);
router.put('/update/:id', upload.single('restaurantImage'), createOrUpdateRestaurant);
router.get('/get/:email', getRestaurantByEmail);
router.delete('/:id', deleteRestaurant);
router.get('/all-restaurant', getAllRestaurants);


// Menu item routes
router.post('/add-menu', upload.single('image'), addMenuItem);
router.put('/edit/:id', upload.single('image'), editMenuItem);
router.delete('/delete/:id', deleteMenuItem);
router.get('/all-menu-items', getAllMenuItems);
router.get('/restaurant-by-menu/:itemId/:email', getRestaurantByMenuItemIdAndEmail);


module.exports = router;
