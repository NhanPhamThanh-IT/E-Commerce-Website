const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const JwtAuth = require('../middlewares/jwtAuth');

router.post('/login', userController.handleLogin);

router.use(JwtAuth.attachJwtToken);
router.use(JwtAuth.passportAuth);
// router.get('/user/profile', userController.getUserByID);
router.post('/logout', userController.handleLogout);

module.exports = router;