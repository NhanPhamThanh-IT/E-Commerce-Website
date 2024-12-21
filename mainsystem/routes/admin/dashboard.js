const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/admin/dashboardController');

router.get('/', homeController.index);
router.get('/api/user-overview', homeController.userOverview);
router.get('/api/product-overview', homeController.productOverview);
router.get('/api/order-overview', homeController.orderOverview);

module.exports = router;
