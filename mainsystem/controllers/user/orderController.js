const Order = require('../../models/orderModel');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const mongoose = require('mongoose');
const Joi = require('joi');

const customerInfoSchema = Joi.object({
    address: Joi.string().min(10).required().messages({
        'string.base': 'Address must be a string.',
        'string.empty': 'Address is required.',
        'string.min': 'Address must be at least 10 characters long.',
        'any.required': 'Address is required.'
    }),
    phone: Joi.string()
    .pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
    .required()
    .messages({
        'string.pattern.base': 'Phone number must be a valid format.',
        'string.empty': 'Phone number is required.',
        'any.required': 'Phone number is required.'
    })
});

exports.checkout = async (req, res) => {
    try {
        const { customerInfo, cart } = req.body;
        if (!customerInfo || !cart || cart.length === 0) {
            return res.status(400).json({ message: 'Invalid request. Customer info and cart are required.' });
        }

        const { error } = customerInfoSchema.validate(customerInfo);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        let totalAmount = 0;
        const productDetails = [];

        for (const item of cart) {
            const product = await Product.findById(item.id).lean();

            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.id} not found.` });
            }

            productDetails.push({ ...product, quantity: item.quantity });

            totalAmount += product.price * item.quantity;
        }

        const user = await User.findOne({ email: req.user.email }).lean();

        if (!user) {
            return res.status(404).json({ message: `User with email ${req.user.email} not found.` });
        }
        const shippingFee = totalAmount * 0.05;
        const newOrder = new Order({
            user_id: user._id,
            list_of_items: productDetails, 
            total_amount: totalAmount, 
            shipping_fee: shippingFee, 
            date: new Date(),
            address: customerInfo.address, 
            phone_number: customerInfo.phone,
        });
        await newOrder.save();
        res.redirect(`https://localhost:3113/transaction/${newOrder._id}`);
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};