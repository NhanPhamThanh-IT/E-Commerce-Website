
exports.index = async (req, res, next) => {
    try {
        return res.render('admin/helps/index');
    } catch (error) {
        next(error);
    }
};