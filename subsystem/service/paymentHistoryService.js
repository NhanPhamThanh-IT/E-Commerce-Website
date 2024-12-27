const PaymentHistory = require('../models/paymentHistoryModel');

class paymentHistoryService {
    static async getById(id) {
        const data = await PaymentHistory.aggregate([
            { $match: { user_id: id } },
            { $project: { order_id: 1, date: 1, total_payment: { $toDecimal: "$total_payment" } } },
            { $addFields: { total_payment: { $round: ["$total_payment", 2] } } }
        ]);
        return data;
    }
}

module.exports = paymentHistoryService;