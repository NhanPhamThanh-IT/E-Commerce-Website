const express = require('express');
const router = express.Router();
require('dotenv').config();
const Auth = require('../middlewares/Auth');
const dashboardController = require('../controllers/dashboardController');

// router.use(Auth.attachJwtToken);
// router.use(Auth.jwtAuth)
// router.use(Auth.isAuthenticated);
router.get('/homepage', dashboardController.index);

module.exports = router;