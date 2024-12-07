const User = require('../models/userModel');

const USERS_PER_PAGE = 5;

exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * USERS_PER_PAGE;
    try {
        const users = await User.find().lean().skip(skip).limit(USERS_PER_PAGE);
        const totalUsers = await User.countDocuments();
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