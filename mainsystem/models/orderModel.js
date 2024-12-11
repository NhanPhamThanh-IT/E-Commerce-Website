const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    list_of_items: { type: Array, required: true },
    total_amount: { type: Number, required: true },
    date: { type: Date, required: true },
    address: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
    phone_number: { type: String, required: true },
    shipping_fee: { type: Number, required: true },
}, { timestamps: true });

const order = mongoose.model('order', orderSchema);

module.exports = order;
