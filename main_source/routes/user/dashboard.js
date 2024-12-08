const express = require('express');
const router = express.Router();
require('dotenv').config();
const passport = require('passport');
const Auth = require('../../middlewares/Auth');
const upload = require('../../middlewares/uploadAvatar');
const dashboardController = require('../../controllers/user/dashboardController');
const userController = require('../../controllers/user/userController');

router.get('/login', (req, res) => {
    res.render('login/index');
});

router.get('/register', (req, res) => {
    res.render('register/index');
});

router.post('/register', userController.createUser);

router.post('/login', userController.handleLogin);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get(
    '/google/callback',
    Auth.googleAuth,
    (req, res, next) => {
        req.login(req.user, (err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/user');
        });
    }
)

router.get(
    '/facebook/callback',
    Auth.facebookAuth,
    (req, res, next) => {
        req.login(req.user, (err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/user');
        });
    }
)
router.get('/', (req, res) => {
    res.redirect('/login');
});

router.use(Auth.attachJwtToken);
router.use(Auth.jwtAuth)
router.use(Auth.isAuthenticated);

router.get('/user', Auth.isUser, dashboardController.index);

router.get('/cart', async (req, res) => {
    res.render('user/cart/index');
});

router.post('/logout', userController.handleLogout);
router.get('/homepage', (req, res) => {
    if (req.user) {
        if (req.user.role === 'admin') {
            return res.redirect('/admin');
        }
        res.redirect('/user');
    }
    res.redirect('/login');
})

router.get('/profile',  (req, res) => {
    console.log('req.user >>', req.user);
    const user = req.user.toObject();
    res.render('profile/index', { user });
});

router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Đường dẫn tệp vừa upload
    const avatarUrl = `/images/${req.file.filename}`;
    console.log(`Avatar uploaded: ${avatarUrl}`);

    // Cập nhật thông tin vào cơ sở dữ liệu

    // Phản hồi về client
    res.status(200).json({ message: 'Avatar uploaded successfully', avatarUrl });

    // Trả về phản hồi hoặc redirect về profile
    res.redirect('/user/profile');
});

// Route cập nhật thông tin người dùng
router.put('/profile', userController.updateUserController);

module.exports = router;