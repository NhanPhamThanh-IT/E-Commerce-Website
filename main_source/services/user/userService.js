require('dotenv').config();
const User = require("../../models/userModel");
const MyError = require('../../cerror');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUserService = async (userData) => {
    try {
        const user = await User.findOne({email: userData.email})
        if (user){
            throw new MyError(403, 'Registration failed', `User with email ${userData.email} exists. Please use another email.`)
        }
        const saltRounds = 10;
        const hashPassword  = await bcrypt.hash(userData.password, saltRounds);
        let result = await User.create({
            name: userData.name,
            email: userData.email,
            password: hashPassword,
        })
        return result;

    } catch (error) {
        throw new MyError(500, error.message, error.desc || 'An unexpected error occurred.');
    }
}

const handleLoginService = async (userData) => {
    try {
        const user = await User.findOne({email: userData.email})
        if (user){
            if (user.loginMethod !== 'email'){
                throw new MyError(400, 'Login failed', 'Account must be logged in using Google/Facebook')
            }
            const isMatch = bcrypt.compare(userData.password, user.password);
            if (isMatch){
                const payload = {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
                const access_token = jwt.sign(payload, 
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    });
                return {
                    access_token,
                    user:{
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    }
                }
            }
            else{
                throw new MyError(404, 'Authentication failed', 'Password is not true')
            }
        }
        else{
            throw new MyError(404, 'Authentication failed',  'Email/Password is not found')
        }
    } catch (error) {
        console.log(error);
        throw new MyError(500, error.message, error.desc || 'An unexpected error occurred.');
    }
}

const getUserByIDService = async (id) => {
    try {
        const result  = await User.findById(id);
        if (result){
            return result;
        }  
        else{
            throw new MyError(400, 'User not found')
        }
    } catch (error) {
        console.log(error);
        throw new MyError(500, error.message, error.desc || 'An unexpected error occurred.');
    }
}

module.exports = {
    createUserService, 
    handleLoginService, 
    getUserByIDService,
}