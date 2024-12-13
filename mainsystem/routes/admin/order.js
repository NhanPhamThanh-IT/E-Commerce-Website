const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/orderController');

router.get('/', orderController.index);
router.get('/api', orderController.getAllOrders);
router.post('/delete/:id', orderController.deleteOrder);

module.exports = router;
