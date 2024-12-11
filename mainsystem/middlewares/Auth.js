const MyError = require('../cerror');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Authentication error.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
        req.user = user;
        next();
    })(req, res, next);
};
const googleAuth = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/user/login' }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Authentication error.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
        const payload = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE, 
        });
        res.cookie('token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: process.env.COOKIE_MAX_AGE,
        });
        req.user = user; // Attach authenticated user to request object
        next();
    })(req, res, next);
};
const facebookAuth = (req, res, next) => {
    passport.authenticate('facebook', { failureRedirect: '/user/login' }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Authentication error.' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
        const payload = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE, 
        });
        res.cookie('token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: process.env.COOKIE_MAX_AGE,
        });
        req.user = user; // Attach authenticated user to request object
        next();
    })(req, res, next);
};
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) { // For session-based auth
        return next();
    }
    if (req.user) { // For JWT-based auth
        return next();
    }
    return next(new MyError(401, 'Unauthorized', 'You must be logged in to access this resource.'));
};
const isAdmin = (req, res, next) => {  
    if (req.user.role === 'admin') {
        return next();
    }
    return next(new MyError(403, 'Forbidden', 'You do not have permission to access this resource.'));
}
const isUser = (req, res, next) => {  
    if (req.user.role === 'user') {
        return next();
    }
    return next(new MyError(403, 'Forbidden', 'You do not have permission to access this resource.'));
}
module.exports = {
    jwtAuth,
    googleAuth,
    facebookAuth,
    isAuthenticated,
    isAdmin,
    isUser
};