const UserService = require('../../services/admin/userService');
const ProductService = require('../../services/admin/productService');
const OrderService = require('../../services/admin/orderService');

exports.index = async (req, res) => {
    try {
        const personalInfo = req.user.toObject();
        const [usersCount, productsCount, ordersCount] = await Promise.all([
            UserService.getQuantity({ 'role': 'user' }),
            ProductService.getQuantity(),
            OrderService.getQuantity(),
        ]);
        const data = {
            personalInfo,
            users: usersCount,
            products: productsCount,
            orders: ordersCount,
        };
        res.render('admin/dashboard/index', data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};

exports.performanceOverview = async (req, res) => {
    try {
        const [previousRevenue] = await Promise.all([
            OrderService.getRevenuePreviousMonths()
        ]);
        res.json({ previousRevenue });
    } catch (err) {
        console.error('Error fetching performance overview data:', err);
        res.status(500).send('Internal Server Error');
    };
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
        res.json({ categories: data });
    } catch (err) {
        console.error('Error fetching product overview data:', err);
        res.status(500).send('Internal Server Error');
    }
}

exports.orderOverview = async (req, res) => {
    try {
        const revenue = await OrderService.getTotalAmount();
        const totalOrdersInMonth = await OrderService.getTotalOrdersInMonth();
        const totalRevenueInMonth = await OrderService.getTotalRevenueInMonth();
        const totalOrdersInWeek = await OrderService.getTotalOrdersInWeek();
        const totalRevenueInWeek = await OrderService.getTotalRevenueInWeek();
        const totalOrdersInDay = await OrderService.getTotalOrdersInDay();
        const totalRevenueInDay = await OrderService.getTotalRevenueInDay();
        res.json({
            revenue: revenue,
            ordersOfMonth: totalOrdersInMonth,
            revenueOfMonth: totalRevenueInMonth,
            ordersOfWeek: totalOrdersInWeek,
            revenueOfWeek: totalRevenueInWeek,
            ordersOfDay: totalOrdersInDay,
            revenueOfDay: totalRevenueInDay
        });
    } catch (err) {
        console.error('Error fetching order overview data:', err);
        res.status(500).send('Internal Server Error');
    }
}