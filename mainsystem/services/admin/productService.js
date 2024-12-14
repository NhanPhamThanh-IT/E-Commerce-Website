const Product = require('../../models/userModel'); 

class ProductService {
    static async getQuantity(filters = {}) {
        return Product.countDocuments(filters);
    };
};

module.exports = ProductService;