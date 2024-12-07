const Order = require('../../models/orderModel');

exports.index = (req, res) => {
    const data = {
        users: userModel
    };
    res.render('admin/users/index', data);
};
