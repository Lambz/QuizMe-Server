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
    description: String,
    noOfPlays: Number,
    lastPlayed: Date
}, {timestamps: true});

const PrivateQuiz = mongoose.model('PrivateQuiz', privateQuizSchema);

export default PrivateQuiz;