const UserServices = require('../../services/admin/userService');
const mongoose = require('mongoose');

exports.index = async (req, res, next) => {
    try {
        return res.render('admin/users/index');
    } catch (error) {
        next(error);
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 5;
        const result = await UserServices.getAllWithPagination(currentPage, itemsPerPage);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }
        const deletedUser = await UserServices.deleteById(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the user.' });
    }
};
exports.getUserInfo=async(req,res,next)=>{
    try{
        const{id}=req.params;
        const user=await UserServices.getById(id);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        return res.status(200).json(user);
    }catch (error) {
        console.error('Error getting order info:', error);
        return res.status(500).json({ message: 'An error occurred while getting order info.' });
    }
}

exports.searchUsers=async(req,res)=>{
    try{
        const{field,query,page,limit}=req.query;
        if(!field||!query){
            return res.status(400).json({message:'Both field and query parameters are required.'});
        }
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 5;
        const result = await UserServices.searchUsers(field, query, currentPage, itemsPerPage);
        res.json({ users: result.users, totalItems: result.totalItems, totalPages: result.totalPages, currentPage: result.currentPage });
    }catch (error) {
        console.error('Error in searchUsers:', error.message);
        res.status(500).json({
            message: 'An error occurred while searching for user',
            error: error.message,
        });
    }
};

exports.viewUser=async(req,res)=>{
    try{
        const{id}=req.params;
        const user=await UserServices.getById(id);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        return res.render('admin/users/profile',{user});
    }catch (error) {
        console.error('Error getting user info:', error);
        return res.status(500).json({ message: 'An error occurred while getting user info.' });
    }
}
exports.editUser = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ URL
        const data = req.body; // Lấy dữ liệu cập nhật từ body
        console.log(id);
        console.log('Update Data:', data);
        // Kiểm tra xem id có hợp lệ hay không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Cập nhật thông tin user
        const updatedUser = await UserServices.updateById(id, data);
        console.log('Updated User:', updatedUser);
        // Nếu không tìm thấy user
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Trả về thông tin user sau khi cập nhật
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'An error occurred while updating the user.' });
    }
};
