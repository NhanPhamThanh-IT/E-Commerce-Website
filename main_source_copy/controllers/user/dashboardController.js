const productService = require('../../services/user/productService');

exports.index = async (req, res, next) => {
    try {
        const { page, limit } = req.query;

        const { products, totalItems, totalPages, currentPage } = await productService.getAllWithPagination(page, limit);
        const categories = await productService.getAllCategories();
        return res.render('user/homepage/index', {
            products,
            categories,
            currentPage,
            totalPages,
        });
    } catch (error) {
        next(error);
    }
}