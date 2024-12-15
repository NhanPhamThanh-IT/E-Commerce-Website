const User = require('../../models/userModel');
const UserServices = require('../../services/admin/userService');

const USERS_PER_PAGE = 5;

const getUserByEmail = async (email) => {
    if (!email) throw new Error('Email is required');
    const user = await User.findOne({ email }).lean();
    if (!user) throw new Error('User not found');
    return user;
};

const getUsersWithPagination = async (page) => {
    const pipeline = [
        { $match: { role: "user" } },
        {
            $facet: {
                data: [
                    { $skip: (page - 1) * USERS_PER_PAGE },
                    { $limit: USERS_PER_PAGE },
                ],
                totalCount: [{ $count: "count" }],
            },
        },
    ];

    const result = await User.aggregate(pipeline);
    const totalActiveUsers = await UserServices.getQuantity({ role: "user", isActive: true });
    const users = result[0]?.data || [];
    const totalUsers = result[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
    return { users, totalUsers, totalPages, totalActiveUsers, totalInactiveUsers: totalUsers - totalActiveUsers };
};

exports.index = async (req, res) => {
    const { email, page = 1 } = req.query;

    try {
        if (email) {
            const user = await getUserByEmail(email);
            return res.render('admin/users/profile', { user });
        }
        const { users, totalUsers, totalPages } = await getUsersWithPagination(parseInt(page));
        const totalActiveUsers = await UserServices.getQuantity({ role: "user", isActive: true });
        const response = {
            users,
            totalPages,
            currentPage: page,
            totalUsers,
            totalActiveUsers,
            totalInactiveUsers: totalUsers - totalActiveUsers
        };
        return req.query.page
            ? res.json(response)
            : res.render('admin/users/index', response);
    } catch (error) {
        const isDev = process.env.NODE_ENV === 'development';
        return res.status(500).send({
            message: 'Error fetching data',
            ...(isDev && { error: error.message }),
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

exports.edit = async (req, res) => {
    const { old_email, firstName, lastName, email, phone, address, gender } = req.body;
    try {
        const user = await User.findOne({ email: old_email, role: 'user' });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (email && email !== old_email) {
            const emailExists = await User.findOne({ email }).lean();
            if (emailExists) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }
            user.email = email;
        }
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.gender = gender || user.gender;
        await user.save();
        res.status(200).json({ message: 'User profile updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

