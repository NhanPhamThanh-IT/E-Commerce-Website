const Product = require('../models/productModel');

exports.list = (req, res) => {
    const product = Product;
    const data = {
        products: product,
    };
    res.render('products/index', { data });
};

exports.create = (req, res) => {
    const { name, price } = req.body;
    Product.create({ name, price: parseFloat(price) });
    res.redirect('/products');
};
