const User = require('../../models/userModel');

const USERS_PER_PAGE = 5;

exports.index = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const skip = (page - 1) * USERS_PER_PAGE;
    const roleFilter = { role: "user" };

    try {
        const pipeline = [
            { $match: roleFilter },
            { $sort: { createdAt: -1 } },
            { 
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: USERS_PER_PAGE },
                        { $project: { password: 0 } } 
                    ],
                    totalCount: [{ $count: "count" }]
                }
            }
        ];

        const result = await User.aggregate(pipeline);
        const users = result[0]?.data || [];
        const totalUsers = result[0]?.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

        if (req.xhr || req.headers['x-requested-with']?.toLowerCase() === 'xmlhttprequest') {
            console.log({ users, totalPages, currentPage: page })
            return res.json({ users, totalPages, currentPage: page });
        }

        res.render('admin/users/index', {
            users,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        const isDev = process.env.NODE_ENV === 'development';
        res.status(500).send({
            message: 'Error fetching users',
            ...(isDev && { error: error.message }),
        });
    }
};
