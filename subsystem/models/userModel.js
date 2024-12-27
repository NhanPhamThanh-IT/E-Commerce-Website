const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, default: "Empty" },
    lastName: { type: String, default: "Empty" },
    email: { type: String, unique: true, sparse: true },
    password: {
        type: String,
        required: function () {
            return this.loginMethod === 'email';
        },
    },
    username: { type: String},
    address: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    phone: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    birthDate: { type: String },
    loginMethod: { type: String, enum: ['email', 'google', 'facebook'], required: true, default: 'email' },
    image: { type: String, default: "" },
    avatar: { type: String, default: "" },  
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
