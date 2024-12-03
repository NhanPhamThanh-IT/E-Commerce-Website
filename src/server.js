require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const connection = require('./config/database');
const configViewEngine = require('./config/viewEngine');

const app = express();
const port = process.env.PORT || 3000;

//config req.body
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data

//config template engine
configViewEngine(app);

// config session management
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))

app.use(cookieParser());

app.use((req, res, next) => {
    next(new MyError(404, 'Page not found', "The page you're looking for doesn't exist."))
});

app.use((err, req, res, next) => {
    statusCode = err.statusCode || 500,
    res.status(statusCode).render('error', {
        statusCode: statusCode,
        message: err.message,
        desc: err.desc
    });
});
// Connect to database and start server
(async () => {
    try {
        await connection();

        app.listen(port, () => {
            console.log(`App listening on port ${port}`)
        })
    } catch (error) {
        console.log(">>> Error connect to DB: ", error)
    }
})()
