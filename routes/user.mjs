import express from 'express';
import models from '../db/db_main.mjs';

const router = express.Router();

router.get('/', async (req, res, next) => {
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