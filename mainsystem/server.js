require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const connection = require('./config/database');
const configViewEngine = require('./config/viewEngine');
const MyError = require('./cerror');
const methodOverride = require('method-override');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const key = require('fs').readFileSync(__dirname + '/certs/key.pem');
const cert = require('fs').readFileSync(__dirname + '/certs/cert.pem');

app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

configViewEngine(app);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/', require('./routes/user/dashboard'));
app.use('/admin', require('./routes/admin/dashboard'));
app.use('/admin/users', require('./routes/admin/user'));
app.use('/admin/products', require('./routes/admin/product'));
app.use('/admin/orders', require('./routes/admin/order'));
app.use('/admin/profile', require('./routes/admin/profile'));
app.use('/product', require('./routes/user/product'));

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
