const User = require('../../models/userModel');

const USERS_PER_PAGE = 5;

exports.index = async (req, res) => {
    const email = req.query.email;

    if (email) {
        try {
            if (!email) {
                return res.status(400).send('Email is required');
            }
            const user = await User.findOne({ email: email }).lean();
            if (!user) {
                return res.status(404).send('User not found');
            }
            return res.render('admin/users/profile', { user });
        } catch (error) {
            return res.status(500).send('Server error');
        }
    }

    const page = req.query.page ? parseInt(req.query.page) : 1;

    const pipeline = [
        {
            $match: {
                role: "user"
            }
        },
        {
            $facet: {
                data: [
                    { $skip: (page - 1) * USERS_PER_PAGE },
                    { $limit: USERS_PER_PAGE },
                ],
                totalCount: [{ $count: "count" }],
            }
        },
    ];

    try {
        const result = await User.aggregate(pipeline);
        const users = result[0]?.data || [];
        const totalUsers = result[0]?.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

        if (!req.query.page) {
            return res.render('admin/users/index', {
                users,
                totalPages,
                currentPage: page,
            });
        } else {
            return res.json({
                users,
                totalPages,
                currentPage: page,
            });
        }
    } catch (error) {
        const isDev = process.env.NODE_ENV === 'development';
        return res.status(500).send({
            message: 'Error fetching users', ...(isDev && { error: error.message }),
        });
    }
};

exports.delete = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOneAndDelete({ email: email, role: "user" });
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.redirect('/admin/users');
    }
    catch (error) {
        return res.status(500).send('Server error');
    };
};