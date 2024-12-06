const userModel = require('../models/userModel');

const USERS_PER_PAGE = 5;

exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * USERS_PER_PAGE;

    try {
        const users = userModel.slice(skip, skip + USERS_PER_PAGE);
        const totalUsers = userModel.length;
        const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

        if (req.xhr) {
            return res.json({ users, totalPages });
        }

        const data = {
            users,
            totalPages,
            currentPage: page
        };
        res.render('users/index', data);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
};