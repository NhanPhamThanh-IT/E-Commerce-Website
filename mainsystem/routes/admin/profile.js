const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/admin/profileController');
const upload = require('../../middlewares/uploadAvatar');

router.get('/', profileController.index);

router.post('/edit', profileController.edit);

router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const avatarUrl = `/user_images/${req.file.filename}`;
    res.status(200).json({ message: 'Avatar uploaded successfully', avatarUrl });
});

module.exports = router;