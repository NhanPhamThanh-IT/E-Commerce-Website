const productService = require('../../services/user/productService');

exports.getProductsByPrice = async (req, res, next) => {
    try {
        const { min, max, page, limit, category, minDiscount } = req.query;
        const minPrice = parseInt(min) || 0;
        const maxPrice = parseInt(max) || 1000000;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 8;
        const categoryFilter = category || '';
        const minDiscountValue = parseInt(minDiscount) || 0;
        const products = await productService.getByPriceAndCategory(minPrice, maxPrice, categoryFilter, minDiscountValue, pageNumber, limitNumber);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        next(error);
    }
};

exports.searhProduct = async (req, res, next) => {
    try {
        const id = req.params.id.split('=');
        const searchBy = id[0] || 'title';
        const value = id[1] || '';
        const { page, limit } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 8;
        const products = await productService.search(searchBy, value, pageNumber, limitNumber);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

exports.getProductsByCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page, limit } = req.query;
        const products = await productService.getByCategory(id, page, limit);
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
}

exports.getProductsById = async (req, res, next) => {
    try {
        const product = await productService.getById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        next(error);
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        const { page, limit } = req.query;

        const result = await productService.getAllWithPagination(page, limit);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
