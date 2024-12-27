const User = require('../models/userModel');

class userService {
    static async getById(id) {
        return User.findById(id).lean();
    }
}

module.exports = userService;