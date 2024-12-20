const express = require('express');
const router = express.Router();
require('dotenv').config();
const passport = require('passport');
const Auth = require('../../middlewares/Auth');
const upload = require('../../middlewares/uploadAvatar');
const dashboardController = require('../../controllers/user/dashboardController');
const userController = require('../../controllers/user/userController');
const orderController = require('../../controllers/user/orderController');
const userModel = require('../../models/userModel');

router.get('/', (req, res) => {
    if (req.cookies?.token) {
        return res.redirect('/homepage');
    }
    res.render('login/index');
});

router.get('/login', (req, res) => {
    if (req.cookies?.token) {
        return res.redirect('/homepage');
    }
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

router.use(Auth.jwtAuth)
router.use(Auth.isAuthenticated);

router.get('/user', Auth.isUser, dashboardController.index);
router.get('/cart', Auth.isUser, async (req, res) => {
    const user = await userModel.findById(req.user._id).lean();
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.render('user/cart/index', { user: user });
});

router.post('/checkout', orderController.checkout);

router.post('/logout', userController.handleLogout);
router.get('/homepage', (req, res) => {
    if (req.user) {
        if (req.user.role === 'admin') {
            return res.redirect('/admin');
        }
        return res.redirect('/user');
    }
    res.redirect('/login');
})

router.get('/profile', Auth.isUser, (req, res) => {
    const user = req.user.toObject();
    res.render('user/profile/index', { user });
});

router.post('/upload-avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const avatarUrl = `/user_images/${req.file.filename}`;
    res.status(200).json({ message: 'Avatar uploaded successfully', avatarUrl });
});

router.put('/save-profile', userController.updateUserController);

module.exports = router;