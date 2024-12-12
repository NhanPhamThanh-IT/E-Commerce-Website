const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');

router.get('/', userController.index);
router.post('/delete', userController.delete);
router.post('/edit', userController.edit);

module.exports = router;
