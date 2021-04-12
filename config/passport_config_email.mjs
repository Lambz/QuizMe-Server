import passport from 'passport';
import strategy from 'passport-local';
import models from '../db/db_main.mjs';
import bcrypt from "bcrypt";
const LocalStrategy = strategy.Strategy;

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await models.User.findById(id);
        done(null, user);
    }
    catch(err) {
        done(err);
    }
})

const localStrategy = passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    async (email, password, done) => {
        try {
            const user = await models.User.findById(email);
            if (!user) { 
                done(null, false, {Message: "User not found!"}); 
            }
            if (await bcrypt.compare(password, user.password)) { 
                done(null, false, {Message: "Password does not match"}); 
            }
            done(null, user);
        }
        catch(err) {
            done(err);
        }
    }
));

export default localStrategy;