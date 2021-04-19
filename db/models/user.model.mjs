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
    totalScore: Number,
    quizInvite: [{
        
    }]
});

userSchema.pre('remove', (next) => {
    this.model('PrivateQuiz').deleteMany({user: this._id}, next);
});

const User = mongoose.model('User', userSchema);

export default User;