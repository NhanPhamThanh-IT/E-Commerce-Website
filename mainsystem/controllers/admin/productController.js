const ProductService = require('../../services/admin/productService');

exports.index = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const currentpage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 6;
        const { products, totalItems, totalPages, currentPage } = await ProductService.getAllWithPagination(currentpage, itemsPerPage);
        return res.render('admin/products/index', {
            Products: products,
            totalItems,
            currentPage: page,
            totalPages,
        });
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