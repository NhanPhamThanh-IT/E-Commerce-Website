const express = require('express');
const router = express.Router();
const helperController = require('../../controllers/admin/helperController.js');


router.get('/', helperController.index);

module.exports = router;
