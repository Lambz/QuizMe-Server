import express from 'express';
import models from '../db/db_main.mjs';
const router = express.Router();

router.get('/', async(req, res, next) => {
    try {
        const questions = await models.Question.find({isPublic: true}).exec();
        res.json(questions);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({Message: "Error while fetching questions"});
    }
});

router.post('/add', async(req, res, next) => {
    const question = req.body.question;
    try {
        const q = await models.Question({
            question: question.question,
            options: question.options,
            answer: question.answer,
            type: question.type,
            isPublic: question.isPublic
        }).save();
        res.json(q);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({Message: "Error while adding question!"});
    }
});

router.get('/category/:category', async(req, res, next) => {
    try {
        const category = req.params.category;
        const questions = await models.Question.find({type: category, isPublic: true}).exec();
        res.json(questions);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({Message: "Error while fetching questions"});
    }
});

export default router;


