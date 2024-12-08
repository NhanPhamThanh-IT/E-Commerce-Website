const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductDetails);
router.put('/edit/:id', productController.editProduct);
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;
