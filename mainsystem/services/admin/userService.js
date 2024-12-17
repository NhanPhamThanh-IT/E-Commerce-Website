const User = require('../../models/userModel'); 


const paginate = async (model, query, currentPage = 1, itemsPerPage = 5) => {
    const skip = (currentPage - 1) * itemsPerPage;
    query['role'] = 'user';
    const users = await model.find(query).lean().skip(skip).limit(itemsPerPage);
    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { users, totalItems, totalPages, currentPage };
};

class UserService {

    static async getById(id) {
        return await User.findById(id).lean();
    }

    static async search(field, value, currentPage = 1, itemsPerPage = 5) {
        const query = {};
        query[field] = { $regex: value, $options: 'i' };
        query['role'] = 'user';
        return await paginate(User, query, currentPage, itemsPerPage);
    }

    static async getAllWithPagination(currentPage = 1, itemsPerPage = 5) {
        return await paginate(User, {role:'user'}, currentPage, itemsPerPage);
    }

    static async deleteById(id) {
        return await User.findByIdAndDelete(id);
    }

    static async getQuantity(filters = {}) {
        return await User.countDocuments(filters);
    }
   

    static async searchUsers(field, query, currentPage = 1, itemsPerPage = 5) {
        const allowedFields = ['email', 'username'];

        if (!allowedFields.includes(field)) {
            throw new Error(`Invalid field. Allowed fields are: ${allowedFields.join(', ')}`);
        }
        const filter = {
            [field]: { $regex: query, $options: 'i' }
        };
        filter['role'] = 'user';
        return await paginate(User, filter, currentPage, itemsPerPage);
    }

}
module.exports = UserService;