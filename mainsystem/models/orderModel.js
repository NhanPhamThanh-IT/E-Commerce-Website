const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    user_id: { type: String, required: true },
    list_of_items: { type: Array, required: true },
    total_amount: { type: Number, required: true },
    date: { type: Date, required: true },
}, { timestamps: true });

const order = mongoose.model('order', orderSchema);

module.exports = order;
