import express from "express";
import models from "../db/db_main.mjs";
const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const questions = await models.Question.find().exec();
        res.json(questions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching questions" });
    }
});

router.post("/add", async (req, res, next) => {
    try {
        const question = req.body.question;
        const q = await models
            .Question({
                question: question.question,
                options: question.options,
                answer: question.answer,
                type: question.type,
                isPublic: question.isPublic,
            })
            .save();
        res.json(q);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while adding question!" });
    }
});

router.post("/update/:id", async (req, res, next) => {
    try {
        const question = await models.Question.findByIdAndUpdate(
            req.params.id,
            {
                question: req.body.question,
                options: req.body.options,
                answer: req.body.answer,
            }
        );
        res.json(question);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while adding question!" });
    }
});

router.get("/category/:category", async (req, res, next) => {
    try {
        const category = req.params.category;
        const questions = await models.Question.find({
            type: category,
            isPublic: true,
        }).exec();
        res.json(questions);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching questions" });
    }
});

router.delete("/delete/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        await models.Question.findByIdAndDelete(id);
        res.json({ Message: "Question deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while deleting question" });
    }
});

export default router;
