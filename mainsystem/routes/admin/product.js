const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');

router.get('/api', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/info/:id', productController.getProductInfo);
router.get('/categories', productController.getCategories);
router.get('/', productController.index);

router.post('/add', productController.addProduct);
router.post('/delete/:id', productController.deleteProduct);
router.post('/edit/:id', productController.editProduct);
router.post('/category/add', productController.addCategory);
router.post('/categories/delete', productController.deleteCategory);

module.exports = router;