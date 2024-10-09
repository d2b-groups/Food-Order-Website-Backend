const express = require('express');
const cors = require('cors'); // Import cors
require('dotenv').config();
const path = require('path');

const con = require('./Database/connection');
const router = require('./router/User');
const restarant = require('./router/restarant_router');
const orderRoutes = require('./router/order_router');

const port = process.env.PORT;
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'https://foodie24venkat.netlify.app' 
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/api/auth", router);
app.use("/api/restaurant", restarant); 
app.use("/api/orders", orderRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
