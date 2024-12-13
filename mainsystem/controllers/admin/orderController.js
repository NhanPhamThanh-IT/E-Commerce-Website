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