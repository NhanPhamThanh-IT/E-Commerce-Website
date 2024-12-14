const UserService = require('../../services/admin/userService');
const ProductService = require('../../services/admin/productService');
const OrderService = require('../../services/admin/orderService');

exports.index = async (req, res) => {
    try {
        const personalInfo = req.user.toObject();
        const [usersCount, productsCount, activedUsers, ordersCount ] = await Promise.all([
            UserService.getQuantity({ role: 'user' }),
            ProductService.getQuantity(),
            UserService.getQuantity({ role: 'user', isActive: true }),
            OrderService.getQuantity(),
        ]);
        const data = {
            users: usersCount,
            products: productsCount,
            orders: ordersCount,
            personalInfo,
            activedUsers,
        };
        res.render('admin/dashboard/index', data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};

