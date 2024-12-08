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
        const product = await Product.findByIdAndUpdate(productId, {
            title,
            category,
            description,
            price,
            stock_quantity
        }, { new: true }).lean();
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.redirect(`/admin/products/${productId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.redirect('/admin/products');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    };
};