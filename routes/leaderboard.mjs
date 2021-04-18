import express from 'express';
import models from '../db/db_main.mjs';

const router = express.Router();

router.get('/', async(req, res, next) => {
    try {
        const dashboard = await models.LeaderBoard.find();
        res.json(dashboard);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({Message: "Error while fetching dashboard"});
    }
})

export default router;