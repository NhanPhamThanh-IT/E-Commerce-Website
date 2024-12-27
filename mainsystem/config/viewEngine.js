const path = require('path');
const express = require('express');
const hbs = require('express-handlebars');

const configViewEngine = (app) => {
    app.engine(
        'hbs',
        hbs.engine({
            extname: '.hbs',
            defaultLayout: 'index',
            layoutsDir: path.join(__dirname, '../views/layouts'),
            partialsDir: path.join(__dirname, '../views/partials'),
        })
    );

    hbs.create({}).handlebars.registerHelper('subtract', (a, b) => a - b);
    hbs.create({}).handlebars.registerHelper('add', (a, b) => a + b);
    hbs.create({}).handlebars.registerHelper('gt', (a, b) => a > b);
    hbs.create({}).handlebars.registerHelper('lt', (a, b) => a < b);
    hbs.create({}).handlebars.registerHelper('eq', (a, b) => a === b);
    hbs.create({}).handlebars.registerHelper('range', function (start, end) {
        let result = [];
        for (let i = start; i <= end; i++)
            result.push(i);
        return result;
    });
    hbs.create({}).handlebars.registerHelper('getData', (data) => data || "Not provied");
    hbs.create({}).handlebars.registerHelper('formatDate', (date) => {
        return new Date(date).toLocaleDateString();
    });
    hbs.create({}).handlebars.registerHelper('formatDateForInput', (date) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return '';
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    hbs.create({}).handlebars.registerHelper('calculateItemTotal', (price, quantity, discount) => {
        const discountedPrice = price - (price * discount / 100);
        const total = discountedPrice * quantity;
        return total.toFixed(2);
    });
    hbs.create({}).handlebars.registerHelper('calculateDiscountPrice', (price, discount) => {
        const discountedPrice = (price - (price * discount / 100)).toFixed(2);
        return discountedPrice;
    });
    hbs.create({}).handlebars.registerHelper('calculateSubtotal', (totalAmount) => {
        return (totalAmount).toFixed(2);
    });

    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../views'));

    app.use(express.static(path.join(__dirname, '../public')));
};

module.exports = configViewEngine;
