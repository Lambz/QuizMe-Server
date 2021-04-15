import passport from "passport";
import googleAuth from 'passport-google-oauth20';
import models from '../db/db_main.mjs';
import mongoose from'mongoose';

// setup process.env vars
import dotenv from 'dotenv';
const env_init = dotenv.config();
if(env_init.error) {
    console.log("\nError while loading env vars...\nError: ", env_init.error);
}

const GoogleStrategy = googleAuth.Strategy;
// cookie data serialization setup

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await models.User.findById(id);
        done(null, user);
    }
    catch(err) {
        console.log("Error fetching user!");
    }
});

const strategy = passport.use(new GoogleStrategy({
    // options for google strategy
    callbackURL: '/auth/google/redirect',
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await models.User.findById(profile.id);
        if(user) {
            done(null, user);
        }
        else {
            const newUser = await models.User({
                _id: profile.id,
                name: profile.displayName,
                quizTaken: [],
                totalScore: 0,
                quizInvite: []
            }).save();
            done(new Error("User not found!"), newUser);
        }
    }
    catch(err) {
        console.log('Error creating new user\nError: ',  err);
    }
}))

export default strategy;