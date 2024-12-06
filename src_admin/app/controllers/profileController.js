const userModel = require('../models/profileModel');

exports.index = (req, res) => {
    const data = {
        users: userModel
    };
    res.render('users/index', data);
};
