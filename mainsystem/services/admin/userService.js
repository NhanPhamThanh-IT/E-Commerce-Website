const User = require('../../models/userModel');

const paginate = async (model, query, currentPage = 1, itemsPerPage = 5) => {
    const skip = (currentPage - 1) * itemsPerPage;
    query['role'] = 'user';
    const users = await model.find(query).lean().skip(skip).limit(itemsPerPage);
    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { users, totalItems, totalPages, currentPage };
};

function classifyAges(age) {
    const groups = {
        "<10": 0,
        "10-20": 0,
        "20-30": 0,
        "30-40": 0,
        "40-50": 0,
        "50-60": 0,
        "60+": 0
    };

    age.forEach(({ value, count }) => {
        if (value < 10) {
            groups["<10"] += count;
        } else if (value <= 20) {
            groups["10-20"] += count;
        } else if (value <= 30) {
            groups["20-30"] += count;
        } else if (value <= 40) {
            groups["30-40"] += count;
        } else if (value <= 50) {
            groups["40-50"] += count;
        } else if (value <= 60) {
            groups["50-60"] += count;
        } else {
            groups["60+"] += count;
        }
    });

    const array = Object.entries(groups).map(([key, value]) => ({
        value: key,
        count: value
    }));

    return array;
}


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
        return await paginate(User, { role: 'user' }, currentPage, itemsPerPage);
    }

    static async deleteById(id) {
        return await User.findByIdAndDelete(id);
    }

    static async getQuantity(filters = {}) {
        const count = await User.countDocuments(filters);
        return count;
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

    static async updateById(id, data) {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }

    static async getStatisticDistinctValue(field) {
        try {
            const distinctValues = await User.distinct(field, { role: 'user' });
            const countPromises = distinctValues.map(item =>
                User.countDocuments({ [field]: item, role: 'user' })
                    .then(count => ({ value: item, count }))
            );
            const counts = await Promise.all(countPromises);
            return field === 'age' ? classifyAges(counts) : counts;
        } catch (error) {
            throw new Error('Error getting distinct values: ' + error.message);
        }
    }
    
}
module.exports = UserService;