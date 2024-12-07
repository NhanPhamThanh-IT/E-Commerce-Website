const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

exports.index = async (req, res) => {
    try {
        const [usersCount, productsCount] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
        ]);
        const ordersCount = 150;
        const fakeData = {
            users: usersCount,
            products: productsCount,
            orders: ordersCount,
        };
        res.render('dashboard/index', fakeData);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};

