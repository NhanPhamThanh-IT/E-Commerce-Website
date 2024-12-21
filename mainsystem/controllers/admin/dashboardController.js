const UserService = require('../../services/admin/userService');
const ProductService = require('../../services/admin/productService');
const OrderService = require('../../services/admin/orderService');

exports.index = async (req, res) => {
    try {
        const personalInfo = req.user.toObject();
        const [usersCount, activedUsers, productsCount, ordersCount,  ] = await Promise.all([
            UserService.getQuantity({ 'role': 'user' }),
            UserService.getQuantity({ role: 'user', isActive: true }),
            ProductService.getQuantity(),
            OrderService.getQuantity(),
        ]);
        const data = {
            personalInfo,
            users: usersCount,
            activedUsers,
            products: productsCount,
            orders: ordersCount,
        };

        res.render('admin/dashboard/index', data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.userOverview = async (req, res) => {
    try {
        const loginMethod = await UserService.getStatisticDistinctValue('loginMethod');
        const gender = await UserService.getStatisticDistinctValue('gender');
        const age = await UserService.getStatisticDistinctValue('age');
        res.json({ loginMethod, gender, age });
    } catch (err) {
        console.error('Error fetching user overview data:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.productOverview = async (req, res) => {
    try {
        const data = await ProductService.getStatisticDistinctValue('category');
        res.json({categories: data});
    } catch (err) {
        console.error('Error fetching product overview data:', err);
        res.status(500).send('Internal Server Error');
    }
}