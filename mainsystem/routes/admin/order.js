const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/orderController');

router.get('/', orderController.index);
router.get('/api', orderController.getAllOrders);

module.exports = router;
