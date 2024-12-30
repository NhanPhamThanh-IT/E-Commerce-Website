const Category = require('../../models/categoryModel');

class CategoryService {
    static async getAll() {
        return await Category.find().lean();
    }

    static async addCategory(name) {
        const newCategory = new Category({ name });
        return await newCategory.save();
    }

    static async deleteByName(name) {
        const category = await Category.findOne({
            name
        });
        return await Category.findByIdAndDelete(category._id);
    }

    
};

module.exports = CategoryService;