const userModel = require('../models/userModel');

exports.index = (req, res) => {
    const data = {
        users: userModel
    };
    res.render('users/index', data);
};
