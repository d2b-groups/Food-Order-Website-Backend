const mongoose = require('mongoose');
const Users = require("../model/usermodel");
const Restaurant = require("../model/restarant_model"); // Add this line
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const verify = await bcrypt.compare(password, user.password);

    if (!verify) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Creating the token with user role
    const token = await jwt.sign({ _id: user.id, user_role: user.role, email:user.email }, process.env.JWT, { expiresIn: "15d" });
    
    // Set the token in a cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Use secure only in production
    res.status(200).json({
      message: "Welcome " + user.name,
      token,
    });
    console.log("Token created");
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      message: "User validation failed",
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email already exists
    let mail = await Users.findOne({ email });
    if (mail) {
      return res.status(500).json({
        message: "Mail ID already signed up"
      });
    }

    // Make sure password is not undefined or empty
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Hash the password
    const bcrypassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await Users.create({ name, password: bcrypassword, email, role });

    res.status(200).send("User and restaurant record created successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "User cannot be created"
    });
  }
};

// New method to fetch user details by ObjectId
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the request parameters
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user }); // Return the user details
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "Error fetching user details" });
  }
};
