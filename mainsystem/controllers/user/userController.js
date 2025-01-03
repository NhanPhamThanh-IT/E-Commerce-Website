const Joi = require('joi');
const userService = require('../../services/user/userService');
const MyError = require('../../cerror');
const User = require("../../models/userModel");
require('dotenv').config();
const createUser = async (req, res, next) => {
    const schema = Joi.object({
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
            return res.status(200).json(result);
        else
            return res.status(400).json('Failed');
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
        const user = await User.findOne({email: req.body.email})
        if (user.role === 'user'){
            if (req.cookies.cart === "[]"){
                res.cookie('cart', JSON.stringify(user.cart));
            }
            else{
                let cart = req.cookies.cart;
                const parsedData = JSON.parse(cart);
                const normalizedData = parsedData.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: parseFloat(item.price) // Convert price from string to number
                }));
                user.cart = normalizedData;
                await user.save();
            }
        }
        res.cookie('token', result.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: process.env.COOKIE_MAX_AGE,
        });
        if (result.user.role === 'admin') {
            return res.redirect('/admin');
        }
        else if (result.user.role === 'user') {
            return res.redirect('/user');
        }
        return res.redirect('/login');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

const handleLogout = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (user){
        let cart = req.cookies.cart;
        if (cart){
            const parsedData = JSON.parse(cart);
            const normalizedData = parsedData.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: parseFloat(item.price) // Convert price from string to number
            }));
            user.cart = normalizedData;
            await user.save();
        }
    }
    res.cookie('cart', '[]');
    res.clearCookie('connect.sid');
    req.logout(function (err) {
        if (err) { return next(err); }
    });
    res.cookie('token', 'deleted', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
    });
    res.redirect('/');
};

const getUserByID = async (req, res, next) => {
    try {
        const result = await userService.getUserByIDService(req.user.id);
        res.status(200).json(result);
    } catch (error) {
        return next(error);
    }
};

const updateUserController = async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = req.body;
        const result = await userService.updateUserService(userId, updateData);
        res.redirect('/profile');
    } catch (error) {
        return next(error);
    }
};
module.exports = {
    createUser,
    handleLogin,
    handleLogout,
    getUserByID,
    updateUserController,
};