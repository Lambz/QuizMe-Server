import express from "express";
import models from "../db/db_main.mjs";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const quiz = await models.Quiz.find({isPublic: true}).populate("questions");
        res.json(quiz);
    } catch (err) {
        console.log("Error while fetching quiz!", err);
        res.status(500).json({ Message: "Error while fetching quizzes" });
    }
});

router.get("/id/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const quiz = await models.Quiz.findById(id)
            .populate("questions")
            .exec();
        let returnData = {
            quiz: quiz,
        };
        if (req.user) {
            const filteredArray = quiz.max_scores.filter(
                (data) => data.user === req.user._id
            );
            if (filteredArray.length > 0) {
                returnData["userScored"] = true;
            } else {
                returnData["userScored"] = false;
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error fetching the quiz" });
    }
});

router.get("/trending", async (req, res, next) => {
    try {
        let quizzes = await models.Quiz.find({isPublic: true})
            .sort("lastPlayed")
            .populate("questions")
            .exec();
        res.json(quizzes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching quizzes!" });
    }
});

router.get("/popular", async (req, res, next) => {
    try {
        let quizzes = await models.Quiz.find({isPublic: true})
            .sort("noOfPlays")
            .populate("questions")
            .exec();
        res.json(quizzes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching quizzes!" });
    }
});

router.get("/latest", async (req, res, next) => {
    try {
        let quizzes = await models.Quiz.find({isPublic: true})
            .sort("createdAt")
            .populate("questions")
            .exec();
        res.json(quizzes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching quizzes!" });
    }
});

router.get("/category/:category", async (req, res, next) => {
    const category = req.params.category;
    try {
        let quizzes = await models.Quiz.find({ isPublic: true, typeOfQuiz: category })
            .populate("questions")
            .exec();
        res.json(quizzes);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            Message: "Error while fetching quizzes for category!",
        });
    }
});

// quiz req format
// quiz obj attached to body
// quiz model with questions attached to it
// question format {question. options, answer}

router.post("/add", async (req, res, next) => {
    if(!req.user) {
        res.status(400).json({Message: "Login before adding quiz"});
    }
    try {
        const newQuiz = req.body.quiz;
        if (newQuiz.questions.length == 0) {
            throw "No Questions";
        }
        let quesArray = [];
        for (let i = 0; i < newQuiz.questions.length; i++) {
            const ques = await models
                .Question({
                    question: newQuiz.questions[i].question,
                    options: newQuiz.questions[i].options,
                    answer: newQuiz.questions[i].answer,
                    type: newQuiz.typeOfQuiz,
                    isPublic: newQuiz.isPublic,
                })
                .save();
            quesArray.push(ques._id);
        }
        const quiz = await models
            .Quiz({
                name: newQuiz.name,
                typeOfQuiz: newQuiz.typeOfQuiz,
                questions: quesArray,
                max_scores: [],
                description: newQuiz.description,
                noOfPlays: 0,
                lastPlayed: Date.now(),
                createdBy: req.user._id,
                isPublic: newQuiz.isPublic
            })
            .save();
        res.json(quiz);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while adding quiz!" });
    }
});

router.post("/update/:id", async (req, res, next) => {
    try {
        const updatedQuiz = req.body.quiz;
        updatedQuiz.questions.forEach(question => {
            let quesUpdate = {
                isPublic: updatedQuiz.isPublic
            }
            models.Question.findByIdAndUpdate(question._id, quesUpdate);
        })
        const update = {
            name: updatedQuiz.name,
            typeOfQuiz: updatedQuiz.typeOfQuiz,
            questions: updatedQuiz.questions,
            max_scores: updatedQuiz.max_scores,
            description: updatedQuiz.description,
            noOfPlays: updatedQuiz.noOfPlays,
            lastPlayed: updatedQuiz.lastPlayed,
            isPublic: updatedQuiz.isPublic
        };
        const quiz = await models.Quiz.findByIdAndUpdate(
            updatedQuiz._id,
            update
        );
        res.json(quiz);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while updating quiz" });
    }
});

// send user, score(body) and quiz id(params)
router.post('/played/:id', async(req, res, next) => {
    if(!req.user) {
        res.status(400).json({Message: "Please login before saving gameplay"});
    }
    try {
        const quizID = req.params.id;
        const score = req.body.score;
        const result = await models.Result({
            quiz: quizID,
            playedBy: req.user._id,
            score: score
        }).save();
        const update = {
            
        }
        await models.User()
    }
    catch(err) {

    }

});


router.delete('/delete/:id', async(req, res, next) => {
    try {
        const id = req.params.id;
        await models.Quiz.findByIdAndDelete(id);
        res.json({Message: "Quiz deleted"});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({Message: "Error while deleting quiz"});
    }
})

export default router;
