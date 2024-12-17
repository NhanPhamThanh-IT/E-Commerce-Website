const User = require('../../models/userModel'); 


const paginate = async (model, query = {}, currentPage = 1, itemsPerPage = 5) => {
    const skip = (currentPage - 1) * itemsPerPage;
    const orders = await model.find(query).lean().skip(skip).limit(itemsPerPage);
    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { orders, totalItems, totalPages, currentPage };
};

class UserService {
    static async getQuantity(filters = {}) {
        return User.countDocuments(filters);
    };
};

module.exports = UserService;