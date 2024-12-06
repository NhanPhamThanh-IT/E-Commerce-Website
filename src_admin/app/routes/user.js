const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to get users with pagination
router.get('/', userController.index);

module.exports = router;
