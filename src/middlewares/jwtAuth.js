const MyError = require('../cerror');
const passport = require('passport');
const attachJwtToken = (req, res, next) => {
    try {
        if (req.cookies?.userid)
        {
            return next(); // Not logged in using email, go to next middleware
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
const passportAuth = (req, res, next) => {
    if (req.cookies?.userid)
    {
        return next(); // Not logged in using email, go to next middleware
    }
    passport.authenticate('jwt', { session: false }, )
    next();
};

module.exports = {
    attachJwtToken,
    passportAuth
};