const profileModel = require('../models/profileModel');

exports.index = (req, res) => {
    const data = {
        user: profileModel,
    };
    res.render('profile/index', data);
};

exports.edit = (req, res) => {
    const new_name = req.body.name;
    const new_email = req.body.email;
    const profile = profileModel;

    profile['name'] = new_name;
    profile['email'] = new_email;

    res.redirect('/admin/profile');
};