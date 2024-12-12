const express = require('express');
const router = express.Router();
require('dotenv').config();
const transactionController = require('../controllers/transactionController');

router.get('/transaction/:id', transactionController.index)

module.exports = router;