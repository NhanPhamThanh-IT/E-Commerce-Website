const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');

router.post('/delete/:id', productController.deleteProduct);
router.post('/edit/:id', productController.editProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductDetails);

module.exports = router;
