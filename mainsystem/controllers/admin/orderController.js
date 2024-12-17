const OrderService = require('../../services/admin/orderService');

exports.index = async (req, res, next) => {
    try {
        return res.render('admin/orders/index', {});
    } catch (error) {
        next(error);
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 5;
        const result = await OrderService.getAllWithPagination(currentPage, itemsPerPage);
        const orders = result.orders[0];
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
};

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
};

exports.searchOrders = async (req, res) => {
    try {
        const { field, query, page, limit } = req.query;
        if (!field || !query) {
            return res.status(400).json({ message: 'Both field and query parameters are required.' });
        }
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 5;
        const result = await OrderService.searchOrders(field, query, currentPage, itemsPerPage);
        res.json({ orders: result.orders, totalItems: result.totalItems, totalPages: result.totalPages, currentPage: result.currentPage });
    } catch (error) {
        console.error('Error in searchOrders:', error.message);
        res.status(500).json({
            message: 'An error occurred while searching for orders.',
            error: error.message,
        });
    }
};
