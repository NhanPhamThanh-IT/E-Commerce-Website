const express = require('express');
const router = express.Router();
require('dotenv').config();
const transactionController = require('../controllers/transactionController');
const paymentHistoryController = require('../controllers/paymentHistoryController');

router.get('/transaction/:id', transactionController.index)
router.post('/process-order', paymentHistoryController.index);

module.exports = router;