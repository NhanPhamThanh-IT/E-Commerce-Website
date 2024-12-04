const MyError = require('../cerror');
const passport = require('passport');
const attachJwtToken = (req, res, next) => {
    try {
        if (req.cookies?.['connect.sid'])
        {
            return next(); // If logged in using session cookies, skip JWT authentication, go to next middleware
        }
        // Retrieve the JWT token from a cookie named 'token'
        const token = req.cookies?.token;
        if (!token) {
            return next(new MyError(401, 'JWT token is missing.'));
        }
        // Attach the token to the Authorization header as a Bearer token
        req.headers['authorization'] = `Bearer ${token}`;
        next();
    } catch (err) {
        console.error('Error attaching JWT token:', err);
        return next(new MyError(500, 'Failed to attach JWT token.'));
    }
};
const jwtAuth = (req, res, next) => {
    if (req.cookies?.['connect.sid']) {
        return next(); // If logged in using session cookies, skip JWT authentication, go to next middleware
    }
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Authentication error.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
        req.user = user; // Attach authenticated user to request object
        next();
    })(req, res, next);
};
const googleAuth = (req, res, next) => {
    passport.authenticate('google',  { failureRedirect: '/user/login' }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Authentication error.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
        req.user = user; // Attach authenticated user to request object
        next();
    })(req, res, next);
};
const facebookAuth = (req, res, next) => {
    passport.authenticate('facebook',  { failureRedirect: '/user/login' }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Authentication error.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
        req.user = user; // Attach authenticated user to request object
        next();
    })(req, res, next);
};

module.exports = {
    attachJwtToken,
    jwtAuth,
    googleAuth,
    facebookAuth
};