const Joi = require('joi');
const userService = require('../services/userService');
const MyError = require('../cerror');
require('dotenv').config();
const createUser = async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return next(new MyError(400, 'Validation error'));
    }

    const result = await userService.createUserService(value);
    if (result) {
        res.redirect('/login')
    } else {
        // render register page with failure messsage
        res.redirect('/register')
    }
};

const handleLogin = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return next(new MyError(400, 'Validation error'));
    }

    try {
        const result = await userService.handleLoginService(value);

        if (!result) {
            return next(new MyError(400, 'Login failed'));
        }
        res.cookie('token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: process.env.COOKIE_MAX_AGE,
        });
        res.status(200).json(result);
        //res.redirect('/')
    } catch (err) {
        console.error(err);
        return next(new MyError(err.message));
    }
};

const handleLogout = (req, res) => {
    // res.clearCookie('userid');
    res.clearCookie('connect.sid'); // clear session cookie - passport
    req.logout(function(err) { // passport session logout
        if (err) { return next(err); }
    });
    res.cookie('token', 'deleted', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
    });
    res.redirect('/user/login');
};

const getUserByID = async (req, res) => {
    //const userid = req.cookies.userid || req.user.id;
    const result = await userService.getUserByIDService(req.user.id);
    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400).json({ message: 'User not found' });
    }
};

module.exports = {
    createUser,
    handleLogin,
    handleLogout,
    getUserByID,
};