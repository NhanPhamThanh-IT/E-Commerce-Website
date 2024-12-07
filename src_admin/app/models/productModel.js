const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
    },
    category: {
        type: String,
        required: true
    },
    stock_quantity: {
        type: Number,
        default: 0,
        min: [0, 'Stock quantity cannot be negative'],
    },
    images: {
        type: [String],
        validate: {
            validator: (value) => value.every(url => /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i.test(url)),
            message: 'Invalid image URL',
        },
    },
    brand: {
        type: String
    },
    model: {
        type: String
    },
    color: {
        type: String
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
    }
}, { timestamps: true });

productSchema.virtual('finalPrice').get(function () {
    return this.price * (1 - this.discount / 100);
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;