const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/', profileController.index);

router.post('/edit', profileController.edit);

module.exports = router;