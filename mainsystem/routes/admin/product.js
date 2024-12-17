const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');

router.get('/api', productController.getAllProducts);
router.post('/add', productController.addProduct);
router.get('/search', productController.searchProducts);
router.get('/info/:id', productController.getProductInfo);
router.post('/delete/:id', productController.deleteProduct);
router.post('/edit/:id', productController.editProduct);
router.get('/', productController.index);

module.exports = router;