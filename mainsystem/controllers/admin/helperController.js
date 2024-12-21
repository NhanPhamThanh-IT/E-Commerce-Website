
exports.index = async (req, res, next) => {
    try {
        return res.render('admin/helper/index', {});
    } catch (error) {
        next(error);
    }
};