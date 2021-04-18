import mongoose from 'mongoose';

const leaderBoardSchema = new mongoose.Schema({ 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    score: Number,
});

const LeaderBoard = mongoose.model('LeaderBoard', leaderBoardSchema);

export default LeaderBoard;