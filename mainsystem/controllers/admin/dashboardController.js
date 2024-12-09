const User = require('../../models/userModel');
const Product = require('../../models/productModel');
const Order = require('../../models/orderModel');

exports.index = async (req, res) => {
    try {
        const personalInfo = req.user.toObject();
        const [usersCount, productsCount, verifiedCount] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Product.countDocuments(),
            User.countDocuments({ isVerified: true }),
        ]);
        const ordersCount = 150;
        const data = {
            users: usersCount,
            products: productsCount,
            orders: ordersCount,
            verified: verifiedCount,
            unverified: usersCount - verifiedCount,
            personalInfo,
        };
        res.render('admin/dashboard/index', data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};

