import express from 'express';
import models from '../db/db_main.mjs';

const router = express.Router();

router.get('/', async (req, res, next) => {
    if(!req.user) {
        res.status(400).json({Message: "Login before fetching details"});
    }
    try {
        const userID = req.user._id;
        const user = await models.User.findById(userID);
        res.json(user);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({Message: "Error while fetching user"});
    }
})

router.get('/all', async (req, res, next) => {
    try {
        const users = await models.User.find();
        res.json(users);
    }
    catch(err) {
        console.log("Error fetching users.\n", err);
        res.json({Message : "Error fetching users"});
    }
});


export default router;