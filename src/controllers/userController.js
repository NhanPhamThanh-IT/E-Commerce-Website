const Joi = require('joi');
const userService = require('../services/userService');
const MyError = require('../cerror');
require('dotenv').config();
const createUser = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return next(new MyError(400, 'Validation error', error.details[0].message));
    }
    try {
        const userData = value;
        const result = await userService.createUserService(userData);
        if (result)
            return res.status(200).json(result); // sửa 
        else
            return res.status(400).json('Failed'); // sửa 
    } catch (error) {
        return next(error);
    }
};

const handleLogin = async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return next(new MyError(400, 'Validation error', error.details[0].message));
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
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

const handleLogout = (req, res, next) => {
    // res.clearCookie('userid');
    res.clearCookie('connect.sid'); // clear session cookie - passport
    req.logout(function (err) { // passport session logout
        if (err) { return next(err); }
    });
    res.cookie('token', 'deleted', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
    });
    res.redirect('/user/login');
};

const getUserByID = async (req, res, next) => {
    //const userid = req.cookies.userid || req.user.id;
    try {
        const result = await userService.getUserByIDService(req.user.id);
        res.status(200).json(result); 
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    createUser,
    handleLogin,
    handleLogout,
    getUserByID,
};