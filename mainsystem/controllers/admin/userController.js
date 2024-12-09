const User = require('../../models/userModel');

const USERS_PER_PAGE = 5;

exports.index = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;

    const pipeline = [
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
            return res.render('admin/users', {
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
        console.error('Error fetching users:', error);
        const isDev = process.env.NODE_ENV === 'development';
        res.status(500).send({
            message: 'Error fetching users', ...(isDev && { error: error.message }),
        });
    };
};