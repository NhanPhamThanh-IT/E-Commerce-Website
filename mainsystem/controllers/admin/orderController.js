const Order = require('../../models/orderModel');

exports.index = (req, res) => {
    const data = {
        users: Order
    };
    res.render('admin/users/index', data);
};