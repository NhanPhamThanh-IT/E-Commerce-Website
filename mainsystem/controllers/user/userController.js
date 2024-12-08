const Joi = require('joi');
const userService = require('../../services/user/userService');
const MyError = require('../../cerror');
const { redirect } = require('react-router-dom');
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

const handleLogout = (req, res, next) => {
    res.clearCookie('connect.sid');
    req.logout(function (err) {
        if (err) { return next(err); }
    });
    res.cookie('token', 'deleted', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
    });
    res.redirect('/login');
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
        const userId = req.user.id; // Lấy ID từ URL
        const updateData = req.body; // Dữ liệu cần cập nhật từ client

        // Gọi service để cập nhật thông tin
        const result = await userService.updateUserService(userId, updateData);

        // Gửi phản hồi thành công
        res.status(200).json(result);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || 'An unexpected error occurred.',
            description: error.desc || null,
        });
    }
};
module.exports = {
    createUser,
    handleLogin,
    handleLogout,
    getUserByID,
    updateUserController,
};