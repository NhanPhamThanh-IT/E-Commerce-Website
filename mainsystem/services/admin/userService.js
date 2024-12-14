const User = require('../../models/userModel'); 

class UserService {
    static async getQuantity(filters = {}) {
        return User.countDocuments(filters);
    };
};

module.exports = UserService;