import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    typeOfQuiz: String,
    questions: 
        [{
            question: String,
            options: [String],
            answer: String,
        }],
    max_scores: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        score: Number,
    }],
}, {timestamps: true});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;