const User = require('../../models/userModel');

const USERS_PER_PAGE = 5;

exports.index = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const skip = (page - 1) * USERS_PER_PAGE;
    try {
        const users = await User.find()
            .lean()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(USERS_PER_PAGE);
        const totalUsers = await User.countDocuments();
        const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            return res.json({ users, totalPages });
        }
        res.render('admin/users/index', {
            users,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        const isDev = process.env.NODE_ENV === 'development';
        res.status(500).send(isDev ? error.message : 'Error fetching users');
    }
};