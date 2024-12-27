require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const MyError = require('./cerror');
const cors = require('cors');
const configViewEngine = require('./config/viewEngine');
const connection = require('./config/database');
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 3113;
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

app.use((req, res, next) => {
    const cookies = req.cookies;
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Authentication error.');
        }
        if (!user) {
            console.log('Unauthorized:', info);
            return res.status(401).send('Unauthorized.');
        }
        req.user = user;
        next();
    })(req, res, next);
});
const PayAccount = require('./models/payAccountModel');
const createAccountIfNotExist = async (req, res, next) => {
    try {
        let account = await PayAccount.findOne({ id: req.user._id });
        if (!account) {
            account = new PayAccount({
                id: req.user._id,
                remainingBalance: 1000, 
            });
            await account.save();
            console.log(`Account created for user ${req.user._id} with balance 1000.`);
        } else {
            console.log(`Account already exists for user ${req.user._id}`);
        }
        req.account = account;
        next();
    } catch (error) {
        console.error(error);
        next(new MyError(500, 'Internal Server Error', 'Could not create or find the account.'));
    }
};

app.use(createAccountIfNotExist); 
app.use('/', require('./routes/index'));
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
