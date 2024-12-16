const Product = require('../../models/productModel');

const paginate = async (model, query = {}, currentPage = 1, itemsPerPage = 6) => {
    const skip = (currentPage - 1) * itemsPerPage;
    const products = await model.find(query).lean().skip(skip).limit(itemsPerPage).sort({ createdAt: -1 });
    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { products, totalItems, totalPages, currentPage };
};

class ProductService {
    // Get all products with optional filters
    static async getAll(filters = {}) {
        return await Product.find(filters).lean();
    }

    // Get a product by ID
    static async getById(id) {
        return await Product.findById(id).lean();
    }

    // Search products by a specific field
    static async search(field, value, currentPage = 1, itemsPerPage = 6) {
        const query = {};
        query[field] = { $regex: value, $options: 'i' };
        return await paginate(Product, query, currentPage, itemsPerPage);
    }

    // Get all products with pagination
    static async getAllWithPagination(currentPage = 1, itemsPerPage = 6) {
        return await paginate(Product, {}, currentPage, itemsPerPage);
    }

    // Update a product by ID
    static async updateById(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).lean();
    }

    // Delete a product by ID
    static async deleteById(id) {
        return await Product.findByIdAndDelete(id);
    }

    // Get the count of products matching the filter
    static async getQuantity(filters = {}) {
        return await Product.countDocuments(filters);
    }

    // Search products by a specific field and query with pagination
    static async searchProducts(field, query, currentPage = 1, itemsPerPage = 6) {
        const allowedFields = ['title', 'category', 'description', 'price'];

        if (!allowedFields.includes(field)) {
            throw new Error(`Invalid field. Allowed fields are: ${allowedFields.join(', ')}`);
        }
        const filter = {
            [field]: { $regex: query, $options: 'i' }
        };
        return await paginate(Product, filter, currentPage, itemsPerPage);
    }
}

module.exports = ProductService;