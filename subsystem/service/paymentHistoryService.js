const PaymentHistory = require('../../mainsystem/models/paymentHistoryModel');

class paymentHistoryService {
    static async getById(id) {
        return await PaymentHistory.find({ user_id: id }).lean()
    }
}

module.exports = paymentHistoryService;