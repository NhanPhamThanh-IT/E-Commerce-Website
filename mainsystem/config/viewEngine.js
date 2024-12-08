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

    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../views'));

    app.use(express.static(path.join(__dirname, '../public')));
};

module.exports = configViewEngine;
