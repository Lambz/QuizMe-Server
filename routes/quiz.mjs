import express from 'express';
import models from '../db/db_main.mjs';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const quiz = await models.Quiz.find();
        res.json(quiz);
    }
    catch(err) {
        console.log("Error while fetching quiz!", err);
        res.status(500).json({Message: "Error while fetching quizzes"});
    }
});

// router.get()

export default router;