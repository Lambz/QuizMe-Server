import mongoose from 'mongoose';

const leaderBoardSchema = new mongoose.Schema({ 
    user: {
        type: mongoose.Schema.Types.String,
        ref: 'User'
    },
    score: Number,
    gamesPlayed: Number
});

const LeaderBoard = mongoose.model('LeaderBoard', leaderBoardSchema);

export default LeaderBoard;