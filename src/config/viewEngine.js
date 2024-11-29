const path = require('path');
const express = require('express');
const hbs = require('express-handlebars');

const configViewEngine = (app) => {
    app.engine('hbs', hbs.engine({
        extname: 'hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, '../views/layouts'), // Đường dẫn tuyệt đối
        partialsDir: path.join(__dirname, '../views/partials'), // Đường dẫn tuyệt đối
        helpers: {

        }
    }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../views')); // Đường dẫn tuyệt đối


    //config static files: image/css/js
    app.use(express.static(path.join(__dirname, '../public'))); 
}

module.exports = configViewEngine;