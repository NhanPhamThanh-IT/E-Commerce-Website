const UserService = require('../../services/admin/userService');
const ProductService = require('../../services/admin/productService');
const OrderService = require('../../services/admin/orderService');

exports.index = async (req, res) => {
    try {
        const personalInfo = req.user.toObject();
        const [usersCount, activedUsers, productsCount, categories, ordersCount,  ] = await Promise.all([
            UserService.getQuantity({ role: 'user' }),
            UserService.getQuantity({ role: 'user', isActive: true }),
            ProductService.getQuantity(),
            ProductService.getStatisticDistinctValue('category'),
            OrderService.getQuantity(),
        ]);

        const data = {
            personalInfo,
            users: usersCount,
            activedUsers,
            products: productsCount,
            categories: JSON.stringify(categories),
            orders: ordersCount,
        };

        res.render('admin/dashboard/index', data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};

