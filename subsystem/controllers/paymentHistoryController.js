const PaymentHistory = require('../models/paymentHistoryModel');
const Order = require('../models/orderModel')

exports.index = async (req, res) => {
    const { orderId  } = req.body;
    try {
        const order = await Order.findById(orderId);
        const totalAmount = order.total_amount;
        const account = req.account;
        const userBalance = account.remainingBalance;
        if (!order)
            return res.status(404).send('Order not found.');
        if (order.status !== 'pending')
            return res.status(400).send('Order is not pending.');
        if (userBalance < totalAmount)
            return res.status(400).json({ message: 'Insufficient balance to process the order.' });
        const newPayment = new PaymentHistory({
            user_id: account.id,
            order_id: orderId,
            total_payment: totalAmount,
            date: new Date()
        });
        await newPayment.save();
        order.status = 'completed';
        await order.save();
        account.remainingBalance -= totalAmount;
        await account.save();
        res.status(200).json({ message: 'Order processed successfully!', paymentId: newPayment._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}