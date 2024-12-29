const Product = require('../../models/productModel'); 

class ProductService {
    static async getAll(filters = {}) {
        return await Product.find(filters).lean();
    }

    static async getById(id) {
        return await Product.findById(id).lean();
    }

    static async search(field, value, currentPage = 1, itemsPerPage = 10) {
        const query = {};
        const skip = (currentPage - 1) * itemsPerPage;
        query[field] = { $regex: value, $options: 'i' };
        const products = await Product.find(query).lean().skip(skip).limit(itemsPerPage);
        const totalItems = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages
        return { products, totalItems, totalPages, currentPage };
    }


    // Get products by category with pagination
    static async getByCategory(category, currentPage = 1, itemsPerPage = 10) {
        const skip = (currentPage - 1) * itemsPerPage;
        const products = await Product.find({ category }).lean().skip(skip).limit(itemsPerPage);
        const totalItems = await Product.countDocuments({ category });
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages

        return { products, totalItems, totalPages, currentPage };
    }


    // Get products with pagination
    static async getAllWithPagination(currentPage = 1, itemsPerPage = 10) {
        const skip = (currentPage - 1) * itemsPerPage;
        const products = await Product.find().lean().skip(skip).limit(itemsPerPage);
        const totalItems = await Product.countDocuments();
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages
        return { products, totalItems, totalPages, currentPage };
    }

    // Get products by price range
    static async getByPriceRange(minPrice, maxPrice, currentPage, itemsPerPage) {
        const skip = (currentPage - 1) * itemsPerPage;
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice },
        }).lean().skip(skip).limit(itemsPerPage);
        const totalItems = await Product.countDocuments({
            price: { $gte: minPrice, $lte: maxPrice },
        });
        return { products, totalItems };
    }

    static async getByPriceAndCategory (minPrice, maxPrice, category, minDiscount, pageNumber, limitNumber)  {
        try {
            const query = {};
    
            if (category) {
                query.category = category; // Filter by category if provided
            }
            if (minPrice && maxPrice) {
                query.price = { $gte: minPrice, $lte: maxPrice }; // Filter by price range
            }
            if (minDiscount) {
                query.discount = { $gte: minDiscount };
            }
            const products = await Product.find(query)
                .skip((pageNumber - 1) * limitNumber) // Skip the products based on page number
                .limit(limitNumber); // Limit the number of products per page
    
            const totalProducts = await Product.countDocuments(query); // Get the total number of products for pagination
            const totalPages = Math.ceil(totalProducts / limitNumber); // Calculate the total number of pages
    
            return {
                products,
                totalPages,
                currentPage: pageNumber,
            };
        } catch (error) {
            throw error;
        }
    }

    // Get count of products in a category
    static async countByCategory(categoryId) {
        return await Product.countDocuments({ category_id: categoryId });
    }

    static async getAllCategories() {
        return await Product.distinct("category").lean();
    }
}

module.exports = ProductService;
