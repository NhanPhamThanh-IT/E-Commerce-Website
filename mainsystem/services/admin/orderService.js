const Order = require('../../models/orderModel'); 

class OrderService {
    static async getAll(filters = {}) {
        return await Order.find(filters).lean();
    }

    static async getById(id) {
        return await Order.findById(id).lean();
    }

    static async search(field, value, currentPage = 1, itemsPerPage = 5) {
        const query = {};
        const skip = (currentPage - 1) * itemsPerPage;
        query[field] = { $regex: value, $options: 'i' };
        const Orders = await Order.find(query).lean().skip(skip).limit(itemsPerPage);
        const totalItems = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return { Orders, totalItems, totalPages, currentPage };
    }

    static async getAllWithPagination(currentPage = 1, itemsPerPage = 5) {
        const skip = (currentPage - 1) * itemsPerPage;
        const Orders = await Order.find().lean().skip(skip).limit(itemsPerPage);
        const totalItems = await Order.countDocuments();
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        return { Orders, totalItems, totalPages, currentPage };
    }

    static async deleteById(id) {
        return await Order.findByIdAndDelete(id);
    }

    static async getQuantity(filters = {}) {
        return await Order.countDocuments(filters);
    }

    static async searchOrder(query) {
        return await Order.findById(query).lean();
    }
}

module.exports = OrderService;