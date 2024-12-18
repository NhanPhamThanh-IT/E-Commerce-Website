const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');

// router.post('/delete', userController.delete);
// router.post('/edit', userController.edit);
router.get('/api', userController.getAllUsers);
router.post('/delete/:id', userController.deleteUser);
//router.post('/edit/:id', userController.editUser);
router.get('/view/:id', userController.viewUser);
router.get('/search', userController.searchUsers);
router.post('/edit/:id', userController.editUser);
router.get('/', userController.index);

module.exports = router;
