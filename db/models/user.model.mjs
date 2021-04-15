import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: String,
    quizTaken: [{
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        score: Number
    }],
    totalScore: Number,
    quizInvite: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        quizName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        }
    }]
});

userSchema.pre('remove', (next) => {
    this.model('PrivateQuiz').deleteMany({user: this._id}, next);
});

const User = mongoose.model('User', userSchema);

export default User;