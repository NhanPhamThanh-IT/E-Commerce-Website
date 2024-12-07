const Product = require('../models/productModel');

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
        res.render('products/index', {
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
    const product = Product.find((p) => p._id === req.params.id);
    res.render('products/details', { product });
}