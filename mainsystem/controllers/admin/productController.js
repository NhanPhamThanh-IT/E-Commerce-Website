const ProductService = require('../../services/admin/productService');
const CategoryService = require('../../services/admin/categoryService');

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
        const { title, category, description, price, stock_quantity, brand, model, color, discount, image } = req.body;
        if (!title || !category || !description || !price || !stock_quantity || !brand || !model || !color || !discount || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const updatedProduct = await ProductService.updateById(id, { title, category, description, price, stock_quantity, brand, model, color, discount, image });
        if (!updatedProduct) {
            return res.status(500).json({ message: 'An error occurred while updating the product' });
        }
        return res.status(200).json(updatedProduct);
    }
    catch (error) {
        console.error('Error updating product:', error);
        next(error);
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required.' });
        }
        const deletedProduct = await ProductService.deleteById(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        return res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the product.' });
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
        res.json({ products: result.products, totalItems: result.totalItems, totalPages: result.totalPages, currentPage: result.currentPage });
    } catch (error) {
        console.error('Error in searchProducts:', error.message);
        res.status(500).json({
            message: 'An error occurred while searching for products.',
            error: error.message,
        });
    }
};

exports.addProduct = async (req, res, next) => {
    try {
        const { title, category, description, price, stock_quantity, brand, model, color, discount, image } = req.body;
        if (!title || !category || !description || !price || !stock_quantity || !brand || !model || !color || !discount || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newProduct = await ProductService.addProduct({ title, category, description, price, stock_quantity, brand, model, color, discount, image });
        if (!newProduct) {
            return res.status(500).json({ message: 'An error occurred while adding the product' });
        }
        return res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        next(error);
    }
}

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await CategoryService.getAll();
        return res.status(200).json(categories);
    } catch (error) {
        console.error('Error getting categories:', error);
        next(error);
    }
}