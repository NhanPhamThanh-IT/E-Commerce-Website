const Product = require('../../models/productModel');

const paginate = async (model, query = {}, currentPage = 1, itemsPerPage = 6) => {
    const skip = (currentPage - 1) * itemsPerPage;
    const products = await model.find(query).lean().skip(skip).limit(itemsPerPage);
    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return { products, totalItems, totalPages, currentPage };
};

class ProductService {
    static async getAll(filters = {}) {
        return await Product.find(filters).lean();
    }

    static async getById(id) {
        return await Product.findById(id).lean();
    }

    static async search(field, value, currentPage = 1, itemsPerPage = 6) {
        const query = {};
        query[field] = { $regex: value, $options: 'i' };
        return await paginate(Product, query, currentPage, itemsPerPage);
    }

    static async getAllWithPagination(currentPage = 1, itemsPerPage = 6) {
        return await paginate(Product, {}, currentPage, itemsPerPage);
    }

    static async updateById(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).lean();
    }

    static async deleteById(id) {
        return await Product.findByIdAndDelete(id);
    }

    static async getQuantity(filters = {}) {
        return await Product.countDocuments(filters);
    }

    static async searchProducts(field, query, currentPage = 1, itemsPerPage = 6) {
        const allowedFields = ['title', 'category', 'brand' ];
        if (!allowedFields.includes(field)) {
            throw new Error(`Invalid field. Allowed fields are: ${allowedFields.join(', ')}`);
        }
        const filter = {
            [field]: { $regex: query, $options: 'i' }
        };
        return await paginate(Product, filter, currentPage, itemsPerPage);
    }

    static async addProduct(productData) {
        return await Product.create(productData);
    }
}

module.exports = ProductService;