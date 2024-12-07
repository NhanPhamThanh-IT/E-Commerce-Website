const express = require('express');
const router = express.Router();
require('dotenv').config();
const passport = require('passport');
const Auth = require('../../middlewares/Auth');
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

router.use(Auth.attachJwtToken);
router.use(Auth.jwtAuth)
router.use(Auth.isAuthenticated);

router.get('/user', Auth.isUser, dashboardController.index);

router.get('/cart', async (req, res) => {
    res.render('user/cart/index');
});

router.post('/logout', userController.handleLogout);

router.get('/', (req, res) => {
    if (req.user) {
        if (req.user.role === 'admin') {
            return res.redirect('/admin');
        }
        res.redirect('/user');
    }
    res.redirect('/login');
});

module.exports = router;