import express from 'express';
import models from '../db/db_main.mjs';

const router = express.Router();

router.get('/', async(req, res, next) => {
    try {
        const dashboard = await models.LeaderBoard.find().populate("user");
        res.json(dashboard);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({Message: "Error while fetching dashboard"});
    }
})

router.post('/update/', async(req, res, next) => {
    if(!req.user) {
        res.status(400).json({Message: "Login before updating user"});
    }
    try {
        const score = req.body.score;
        const user = await models.LeaderBoard.findByOne({user: req.user._id});
        const update = {
            score: user.score + score,
            gamesPlayed: user.gamesPlayed + 1
        }
        const newUser = await models.LeaderBoard.findOneAndUpdate({user: req.user._id}, update);
        res.json(newUser);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({Message: "Error while updating the user leaderboard data"});
    }
});


export default router;