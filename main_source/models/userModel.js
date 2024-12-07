const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//     productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//     quantity: { type: Number, required: true, min: 1 },
// });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: {
        type: String,
        required: function () {
            return this.loginMethod === 'email';
        },
    },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    loginMethod: { type: String, enum: ['email', 'google', 'facebook'], required: true, default: 'email' },
    emailToken: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
