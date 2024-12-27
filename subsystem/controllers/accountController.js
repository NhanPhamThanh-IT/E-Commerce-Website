const PayAccount = require('../../mainsystem/models/payAccountModel');
const User = require('../../mainsystem/models/userModel');
const paymentHistoryService = require('../service/paymentHistoryService')

exports.index = async (req, res, next) => {
    try {
        const account = req.account;
        const user = await User.findById(req.user._id).lean();
        const paymentHistory = await paymentHistoryService.getById(account.id);

        if (!user) {
            return res.status(404).send('User not found.');
        }
        
        res.render('subsystem/account/index', {
            user,
            balance: account.remainingBalance,
            paymentHistory
        });
    } catch (error) {
        console.error('Error rendering add money page:', error);
        res.status(500).send('Internal server error.');
    }
};

exports.addMoney = async (req, res, next) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).send('Invalid amount.');
        }

        const userAccount = await PayAccount.findOne({ id: req.user._id });

        if (!userAccount) {
            return res.status(404).send('Pay account not found.');
        }

        userAccount.remainingBalance += amount;
        await userAccount.save();

        res.status(200).json({ message: `Successfully added $${amount} to your balance.` });
    } catch (error) {
        console.error('Error adding money:', error);
        res.status(500).send('Internal server error.');
    }
};