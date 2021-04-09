import mongoose from 'mongoose';

const privateQuizSchema = new mongoose.Schema({
    typeOfQuiz: String,
    questions: 
        [{
            question: String,
            options: [String],
            answer: String,
        }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    max_scores: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        score: Number,
    }],
}, {timestamps: true});

const PrivateQuiz = mongoose.model('PrivateQuiz', privateQuizSchema);

export default PrivateQuiz;