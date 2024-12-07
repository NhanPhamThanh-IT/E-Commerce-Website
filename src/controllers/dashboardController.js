const productService = require('../services/productService');

exports.index = async (req, res, next) => {
    try {
        const { page, limit } = req.query;

        const { products, totalItems, totalPages, currentPage } = await productService.getAllWithPagination(page, limit);
        const categories = await productService.getAllCategories();
        return res.render('homepage/index', {
            products,
            categories,
            currentPage,
            totalPages,
        });
    } catch (error) {
        next(error);
    }
}