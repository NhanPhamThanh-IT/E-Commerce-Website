const User = require('../../models/userModel');

exports.index = async (req, res) => {
    const sessionInfo = req.user.toObject();
    const adminInfo = await User.findById(sessionInfo._id).lean();
    res.render('admin/profile/index', { adminInfo } );
};

exports.edit = async (req, res) => {
    try {
        const { name: new_name, email: new_email } = req.body;
        await User.findByIdAndUpdate(
            req.user._id, 
            { name: new_name, email: new_email },
            { new: true, runValidators: true }
        );
        res.redirect('/admin/profile');
    } catch (error) {
        console.error('Error updating admin profile:', error);
        res.status(500).send('Internal Server Error');
    }
};
