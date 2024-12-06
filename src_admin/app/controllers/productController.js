const Product = require('../models/productModel');

exports.list = (req, res) => {
    const products = Product.findAll();
    res.render('products/list', { title: 'Product List', products });
};

exports.create = (req, res) => {
    const { name, price } = req.body;
    Product.create({ name, price: parseFloat(price) });
    res.redirect('/products');
};
