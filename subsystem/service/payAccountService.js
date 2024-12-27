const PayAccount = require('../models/payAccountModel');

class payAccountService {
    static async findById(id) {
        const data = await PayAccount.findOne({ id: id })
        console.log(data);
        return data;
    }
}

module.exports = payAccountService;