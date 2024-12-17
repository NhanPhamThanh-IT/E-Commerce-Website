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


}

module.exports = OrderService;
