const Order = require('../../models/orderModel');
const User = require('../../models/userModel');
const mongoose = require('mongoose');

const getUserNamebyUserid = async (UserId) => {
    const user = await User.findById(UserId).lean();
    return user ? user.lastName : 'N/A';
};

const paginate = async (model, query = {}, currentPage = 1, itemsPerPage = 5) => {
    const skip = (currentPage - 1) * itemsPerPage;
    const orders = await model.find(query).lean().skip(skip).limit(itemsPerPage);
    for (let i = 0; i < orders.length; i++) {
        orders[i]["user_name"] = await getUserNamebyUserid(orders[i].user_id);
    }
    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { orders, totalItems, totalPages, currentPage };
};

class OrderService {
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

    /*
    static async searchOrders(field, query, currentPage = 1, itemsPerPage = 5) {
        const allowedFields = ['user_id', 'date', 'total_amount'];

        if (!allowedFields.includes(field)) {
            throw new Error(`Invalid field. Allowed fields are: ${allowedFields.join(', ')}`);
        }
        const filter = {
            [field]: { $regex: query, $options: 'i' }
        };
        return await paginate(Order, filter, currentPage, itemsPerPage);
    }*/

    static async searchOrders(field, query, currentPage = 1, itemsPerPage = 5) {
        const allowedFields = ['user_id', 'date', 'total_amount', 'user_name'];

        if (!allowedFields.includes(field)) {
            throw new Error(`Invalid field. Allowed fields are: ${allowedFields.join(', ')}`);
        }

        if (field === 'user_name') {

            // Tìm tất cả users có lastName khớp query
            const users = await User.find({ lastName: { $regex: query, $options: 'i' } }).lean();
            if (users.length === 0) {
                // Không tìm thấy user, trả về rỗng
                return { orders: [], totalItems: 0, totalPages: 0, currentPage };
            }

            const userIds = users.map(user => new mongoose.Types.ObjectId(user._id)); // Chuyển _id sang ObjectId

            // Tìm order liên quan đến danh sách user_id
            return await paginate(Order, { user_id: { $in: userIds } }, currentPage, itemsPerPage);
        } else {
            // Tìm kiếm với các trường khác trong Order
            const filter = {
                [field]: { $regex: query, $options: 'i' }
            };
            return await paginate(Order, filter, currentPage, itemsPerPage);
        }
    }

    static async getStatisticDistinctValue(field) {
        try {
            const distinctValues = await Order.distinct(field);
            const countPromises = distinctValues.map(item => 
                Order.countDocuments({ [field]: item }).then(count => ({ value: item, count }))
            );
            const counts = await Promise.all(countPromises);
            return counts;
        } catch (error) {
            throw new Error('Error getting distinct values: ' + error.message);
        }
    }

    static async getTotalAmount() {
        const orders = await Order.find({}).lean();
        const totalAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);
        return Math.round(totalAmount);
    }

    static async getTotalOrdersInMonth() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return await Order.countDocuments({ date: { $gte: startOfMonth, $lte: endOfMonth } });
    }

    static async getTotalOrdersInWeek() {
        const now = new Date();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()));
        return await Order.countDocuments({ date: { $gte: startOfWeek, $lte: endOfWeek } });
    }

    static async getTotalOrdersInDay() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        return await Order.countDocuments({ date: { $gte: startOfDay, $lte: endOfDay } });
    }

    static async getTotalRevenueInMonth() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const orders = await Order.find({ date: { $gte: startOfMonth, $lte: endOfMonth } }).lean();
        const totalAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);
        return Math.round(totalAmount);
    }

    static async getTotalRevenueInWeek() {
        const now = new Date();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()));
        const orders = await Order.find({ date: { $gte: startOfWeek, $lte: endOfWeek } }).lean();
        const totalAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);
        return Math.round(totalAmount);
    }

    static async getTotalRevenueInDay() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const orders = await Order.find({ date: { $gte: startOfDay, $lte: endOfDay } }).lean();
        const totalAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);
        return Math.round(totalAmount);
    }

    static async getRevenuePreviousMonths() {
        const now = new Date();
        const months = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const orders = await Order.find({ date: { $gte: startOfMonth, $lte: endOfMonth } }).lean();
            const totalAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);
            months.push({ month: date.getMonth() + 1, year: date.getFullYear(), totalAmount: Math.round(totalAmount) });
        }
        return months;
    }

}

module.exports = OrderService;
