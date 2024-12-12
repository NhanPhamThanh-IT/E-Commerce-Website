const mongoose = require('mongoose');
const Order = require('../../mainsystem/models/orderModel');
const PayAccount = require('../../mainsystem/models/payAccountModel');
const User = require('../../mainsystem/models/userModel');
const MyError = require('../cerror');
exports.index = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid order ID format.');
        }
        
        const order = await Order.findById(id).lean();

        if (!order) {
            return res.status(404).send('Order not found.');
        }
        if (order.user_id.toString() !== req.user._id.toString()) {
            return next(new MyError(403, 'Forbidden', 'You do not have permission to view this order.'))
        }
        const userAccount = await PayAccount.findOne({ id: req.user._id }).lean();

        if (!userAccount) {
            return res.status(404).send('Pay account not found.');
        }

        const user = await User.findOne({ _id: req.user._id }).lean();
        if (!userAccount) {
            return res.status(404).send('User not found.');
        }
        res.render('user/transaction/index', { order, balance: userAccount.remainingBalance, user });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send('Internal server error.');
    }
};