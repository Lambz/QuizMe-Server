import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    typeOfQuiz: String,
    questions: 
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        }],
    max_scores: [{
        // NOTE: top 10/20 scores stored here
        // if user among them then additional field added at the end
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        score: Number,
    }],
    description: String,
    lastPlayed: Date,
    noOfPlays: Number
}, {timestamps: true});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;