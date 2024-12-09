const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');

router.post('/delete/:id', productController.deleteProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductDetails);
router.put('/edit/:id', productController.editProduct);

module.exports = router;
