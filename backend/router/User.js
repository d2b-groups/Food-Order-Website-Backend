const express = require('express');
const controller = require('../controller/user');
// const isauth = require("../../middleware/authetcation")

const router = express.Router();

router.post('/login', controller.login);
router.post('/signup', controller.signup);
router.get('/user/:id', controller.getUserById); // New endpoint to get user by ID

module.exports = router;
