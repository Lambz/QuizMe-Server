import express from 'express';
import cookieSession from 'cookie-session';
import passport from 'passport';
import {connectDB} from './db/db_main.mjs';

// auth imports for loading authConfig
import PassportConfig from './config/passport_config.mjs';

// Routes imports
import authRouter from './routes/auth.mjs';

const app = express();

// passport and cookies setup
app.use(cookieSession({
    keys: [process.env.COOKIE_ENCRYPT_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;
//app crash loggging code middleware

// Routes

app.get('', async (req, res, next) => {
    res.json({"Message": "Welcome to QuizMe Server"});
})

// Routes setup
app.use('/auth', authRouter);

connectDB().then(async() => {
    app.listen(PORT, () => {
        console.log("\nServer running at port ", PORT);
    });
});
