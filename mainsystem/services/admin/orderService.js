const Order = require('../../models/orderModel');

const paginate = async (model, query = {}, currentPage = 1, itemsPerPage = 5) => {
    const skip = (currentPage - 1) * itemsPerPage;
    const orders = await model.find(query).lean().skip(skip).limit(itemsPerPage);
    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { orders, totalItems, totalPages, currentPage };
};

class OrderService {
    static async getAll(filters = {}) {
        return await Order.find(filters).lean();
    }

    static async getById(id) {
        return await Order.findById(id).lean();
    }

    static async search(field, value, currentPage = 1, itemsPerPage = 5) {
        const query = {};
        query[field] = { $regex: value, $options: 'i' };
        return await paginate(Order, query, currentPage, itemsPerPage);
    }

    static async getAllWithPagination(currentPage = 1, itemsPerPage = 5) {
        return await paginate(Order, {}, currentPage, itemsPerPage);
    }

    static async deleteById(id) {
        return await Order.findByIdAndDelete(id);
    }

    static async getQuantity(filters = {}) {
        return await Order.countDocuments(filters);
    }

    static async searchOrders(field, query, currentPage = 1, itemsPerPage = 5) {
        const allowedFields = ['user_id', 'date', 'total_amount'];

        if (!allowedFields.includes(field)) {
            throw new Error(`Invalid field. Allowed fields are: ${allowedFields.join(', ')}`);
        }
        const filter = {
            [field]: { $regex: query, $options: 'i' }
        };
        return await paginate(Order, filter, currentPage, itemsPerPage);
    }
}

module.exports = OrderService;
