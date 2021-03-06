import mongoose from 'mongoose';
import User from './models/user.model.mjs';
import Quiz from './models/quiz.model.mjs';
import PrivateQuiz from './models/privateQuiz.model.mjs';
import Question from './models/question.model.mjs';
import LeaderBoard from './models/leaderboard.model.mjs';
import Result from './models/result.model.mjs';
import Invite from './models/invite.model.mjs';

export const connectDB = () => {
    return mongoose.connect(process.env.DB_URL);
}

const models = {User, Quiz, PrivateQuiz, Question, LeaderBoard, Result, Invite};

export default models;
