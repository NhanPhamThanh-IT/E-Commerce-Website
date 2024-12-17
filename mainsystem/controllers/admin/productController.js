const ProductService = require('../../services/admin/productService');

exports.index = async (req, res, next) => {
    try {
        return res.render('admin/products/index');
    } catch (error) {
        next(error);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 6;
        const result = await ProductService.getAllWithPagination(currentPage, itemsPerPage);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.getProductInfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await ProductService.getById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error('Error getting product info:', error);
        next(error);
    }
};

exports.editProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, category, description, price, stock_quantity } = req.body;
        if (!title || !category || !description || !price || !stock_quantity) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const updatedProduct = await ProductService.updateById(id, { title, category, description, price, stock_quantity });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.redirect(`/admin/products/${id}`);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _action } = req.body;

        if (_action !== 'delete') {
            return res.status(400).json({ message: 'Invalid action' });
        }

        const deletedProduct = await ProductService.deleteById(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        next(error);
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { field, query, page, limit } = req.query;
        if (!field || !query) {
            return res.status(400).json({ message: 'Both field and query parameters are required.' });
        }
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 6;
        const result = await ProductService.searchProducts(field, query, currentPage, itemsPerPage);
        console.log('searchProducts result:', result);
        res.json({ products: result.products, totalItems: result.totalItems, totalPages: result.totalPages, currentPage: result.currentPage });
    } catch (error) {
        console.error('Error in searchOrders:', error.message);
        res.status(500).json({
            message: 'An error occurred while searching for orders.',
            error: error.message,
        });
    }
};