const Category = require('../../models/categoryModel');

class CategoryService {
    static async getAll() {
        return await Category.find().lean();
    }

    static async addCategory(name) {
        const newCategory = new Category({ name });
        return await newCategory.save();
    }
};

module.exports = CategoryService;