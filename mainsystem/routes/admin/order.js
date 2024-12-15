const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/admin/orderController');

router.get('/api', orderController.getAllOrders);
router.get('/info/:id', orderController.getOrderInfo);
router.post('/delete/:id', orderController.deleteOrder);
router.get('/search', orderController.searchOrders);
router.get('/', orderController.index);

module.exports = router;
