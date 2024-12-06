const userModel = require('../models/orderModel');

exports.index = (req, res) => {
    const data = {
        users: userModel
    };
    res.render('users/index', data);
};
