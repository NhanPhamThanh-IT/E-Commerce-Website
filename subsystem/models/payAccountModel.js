const mongoose = require('mongoose');

const payAccountSchema = new mongoose.Schema({
    id: { type: String, required: true },
    remainingBalance: { type: Number, required: true },
}, { timestamps: true });

const PayAccount = mongoose.model('PayAccount', payAccountSchema);

module.exports = PayAccount;
