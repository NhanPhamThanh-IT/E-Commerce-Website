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

exports.getAllOrders = async(req, res, next) => {
    try {
        const { page, limit } = req.query;
        const result = await OrderService.getAllWithPagination(page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};