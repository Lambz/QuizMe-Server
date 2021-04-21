import express from 'express';
import cookieSession from 'cookie-session';
import passport from 'passport';
import {connectDB} from './db/db_main.mjs';

// auth imports for loading authConfig
import PassportConfig from './config/passport_config.mjs';
import LocalConfig from './config/passport_config_email.mjs';

// Routes imports
import authRouter from './routes/auth.mjs';
import userRouter from './routes/user.mjs';
import quizRouter from './routes/quiz.mjs';
import questionRouter from './routes/question.mjs';
import leaderboardRouter from './routes/leaderboard.mjs';

const app = express();

// passport and cookies setup
app.use(cookieSession({
    keys: [process.env.COOKIE_ENCRYPT_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());

// express setup
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded());
//app crash loggging code middleware

// Routes

app.get('', async (req, res, next) => {
    res.json({"Message": "Welcome to QuizMe Server"});
})

// Routes setup
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/quiz', quizRouter);
app.use('/question', questionRouter);
app.use('/leaderboard', leaderboardRouter);

connectDB().then(async() => {
    app.listen(PORT, () => {
        console.log("\nServer running at port ", PORT);
    });
});
