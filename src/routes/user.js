const express = require('express');
const router = express.Router();
const passport = require('passport');
require('dotenv').config();
const userController = require('../controllers/userController');
const Auth = require('../middlewares/Auth');

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
            res.redirect('/user/profile');
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
            res.redirect('/user/profile');
        });
    }
)
router.use(Auth.attachJwtToken);
router.use(Auth.passportAuth);
// router.get('/user/profile', userController.getUserByID);
router.get('/profile',  (req, res) => {
    console.log('req.user >>', req.user);
    res.status(200).json("hi " + req.user.name);
});
router.post('/logout', userController.handleLogout);

module.exports = router;