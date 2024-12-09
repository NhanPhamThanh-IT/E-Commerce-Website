const Product = require('../../models/productModel');

exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;
        const totalProducts = await Product.countDocuments();
        const products = await Product.find()
            .lean()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        res.render('admin/products/index', {
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getProductDetails = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).lean();
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('admin/products/details', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { title, category, description, price, stock_quantity } = req.body;
        if (!title || !category || !description || !price || !stock_quantity) {
            return res.status(400).send('All fields are required');
        }
        if (price < 0 || stock_quantity < 0) {
            return res.status(400).send('Price and stock quantity cannot be negative');
        }
        const product = await Product.findByIdAndUpdate(
            productId,
            { title, category, description, price, stock_quantity },
            { new: true, runValidators: true }
        ).lean();
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.redirect(`/admin/products/${productId}`);
    } catch (error) {
        console.error('Error updating product:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).send('Validation Error: ' + error.message);
        }
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteProduct = async (req, res) => {
    const { _action } = req.body;
    const { id } = req.params;

    if (_action === 'delete') {
        try {
            await Product.findByIdAndDelete(id);
            res.redirect('/admin/products');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting product');
        }
    } else {
        res.status(400).send('Invalid action');
    }
};