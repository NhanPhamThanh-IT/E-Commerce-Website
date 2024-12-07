const express = require('express');
const router = express.Router();
require('dotenv').config();
const Auth = require('../middlewares/Auth');
// router.use(Auth.attachJwtToken);
// router.use(Auth.jwtAuth)
// router.use(Auth.isAuthenticated);
const productController = require('../controllers/productController');

router.get('/price', productController.getProductsByPrice);

router.get('/search/:id', productController.searhProduct);

router.get('/category/:id', productController.getProductsByCategory);

router.get('/:id', productController.getProductsById);

router.get('/', productController.getAllProducts);

module.exports = router;