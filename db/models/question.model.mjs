import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    answer: String,
    type: String,
    isPublic: Boolean
}, {timestamps: true});

const Question = mongoose.model('Question', questionSchema);

export default Question;