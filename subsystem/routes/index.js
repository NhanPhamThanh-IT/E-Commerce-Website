const express = require('express');
const router = express.Router();
require('dotenv').config();
const transactionController = require('../controllers/transactionController');
const paymentHistoryController = require('../controllers/paymentHistoryController');
const accountController = require('../controllers/accountController');

router.get('/transaction/:id', transactionController.index);
router.post('/process-order', paymentHistoryController.index);
router.get('/account', accountController.index);
router.post('/add-money', accountController.addMoney);

module.exports = router;