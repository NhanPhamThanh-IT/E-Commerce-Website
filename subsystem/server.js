require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const connection = require('../mainsystem/config/database');
const configViewEngine = require('../mainsystem/config/viewEngine');
const MyError = require('./cerror');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const key = fs.readFileSync(__dirname + '/certs/key.pem');
const cert = fs.readFileSync(__dirname + '/certs/cert.pem');
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

configViewEngine(app);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
require('../mainsystem/config/passport')(passport);


// app.use('/', require('./routes/user/dashboard')); // Sai duong dan


app.use((req, res, next) => {
    next(new MyError(404, 'Page not found', "The page you're looking for doesn't exist."))
});

app.use((err, req, res, next) => {
    statusCode = err.statusCode || 500,
        res.status(statusCode).send({
            statusCode: statusCode,
            message: err.message,
            desc: err.desc
        });
});

(async () => {
    try {
        await connection();
        https.createServer({ key: key, cert: cert }, app).listen(PORT, () => {
            console.log(`>>> Server is running on https://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(">>> Error connect to DB: ", error)
    }
})()
