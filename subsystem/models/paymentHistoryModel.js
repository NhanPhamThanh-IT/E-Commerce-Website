const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    order_id: { type: String, required: true },
    total_payment: { type: Number, required: true },
    date: { type: Date, required: true },
}, { timestamps: true });

const PaymentHistory = mongoose.model('PaymentHistory', paymentHistorySchema);

module.exports = PaymentHistory;
