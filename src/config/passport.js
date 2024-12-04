const JwtStrategy = require('passport-jwt').Strategy;
const extractJwt  = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const opts = {  
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}
const User = require('../models/userModel')

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/user/google/callback',
            },
            async (accessToken, refreshToken, googleData, done) => {
                let user = await User.findOne({ email: googleData.emails[0].value });
                if (user) {
                    done(null, user);
                } else {
                    const newUser = new User({
                        name: googleData.name.givenName,
                        email: googleData.emails[0].value,
                        // password: 'none',
                        loginMethod: 'google',
                        isVerified: true,
                    });
                    user = await User.create(newUser);
                    done(null, user);
                }
            }
        )
    )
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: '/user/facebook/callback',
        profileFields: ['id', 'emails', 'name'],
    }, async (accessToken, refreshToken, facebookData, done) => {
        if (!facebookData?.emails[0]?.value) {
            return done(null, false, { message: 'Email not provided by Facebook' });
        }
        let user = await User.findOne({ email: facebookData.emails[0].value });
        if (user) {
            done(null, user);
        } else {
            const newUser = new User({
                name: facebookData.name.givenName,
                email: facebookData.emails[0].value,
                // password: 'none',
                loginMethod: 'facebook',
                isVerified: true,
            });
            user = await User.create(newUser);
            done(null, user);
        }
    }
    ))
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}