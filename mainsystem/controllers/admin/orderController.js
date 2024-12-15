const OrderService = require('../../services/admin/orderService');

exports.index = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const { Orders, totalItems, totalPages, currentPage } = await OrderService.getAllWithPagination(page, limit);
        return res.render('admin/orders/index', {
            orders: Orders,
            totalItems,
            currentPage,
            totalPages,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await OrderService.getAllWithPagination(page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required.' });
        }
        const deletedOrder = await OrderService.deleteById(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        return res.status(200).json({ message: 'Order deleted successfully.' });
    } catch (error) {
        console.error('Error deleting order:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the order.' });
    }
}

exports.getOrderInfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await OrderService.getById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        return res.status(200).json(order);
    } catch (error) {
        console.error('Error getting order info:', error);
        return res.status(500).json({ message: 'An error occurred while getting order info.' });
    }
}

const Order = require('../../models/orderModel');

exports.searchOrders = async (req, res) => {
    try {
        const { field, query } = req.query;

        if (!field || !query) {
            return res.status(400).json({ message: 'Both field and query parameters are required.' });
        }

        const allowedFields = ['user_id', 'date', 'total_amount'];
        if (!allowedFields.includes(field)) {
            return res.status(400).json({ message: `Invalid field. Allowed fields are: ${allowedFields.join(', ')}` });
        }

        const filter = {
            [field]: { $regex: query, $options: 'i' }
        };

        const orders = await Order.find(filter);

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found.' });
        }

        res.json({ Orders: orders });
    } catch (error) {
        console.error('Error in searchOrders:', error);
        res.status(500).json({
            message: 'An error occurred while searching for orders.',
            error: error.message,
        });
    }
};
