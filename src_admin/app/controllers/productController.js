const Product = require('../models/productModel');

exports.getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const totalProducts = Product.length;
    const products = Product.slice(skip, skip + limit);
    res.render('products/index', {
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
    });
};

