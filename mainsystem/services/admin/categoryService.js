const Category = require('../../models/categoryModel');

class CategoryService {
    static async getAll() {
        return await Category.find().lean();
    }
};

module.exports = CategoryService;