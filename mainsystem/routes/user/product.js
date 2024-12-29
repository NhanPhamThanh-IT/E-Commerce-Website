const express = require('express');
const router = express.Router();
require('dotenv').config();
const Auth = require('../../middlewares/Auth');

const productController = require('../../controllers/user/productController');

router.get('/price', productController.getProductsByPrice);

router.get('/search/:id', productController.searhProduct);

router.get('/category/:id', productController.getProductsByCategory);

router.get('/:id', productController.getProductsById);

router.get('/', productController.getAllProducts);

module.exports = router;