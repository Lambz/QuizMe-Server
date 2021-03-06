import express from "express";
import models from "../db/db_main.mjs";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const quiz = await models.Quiz.find({ isPublic: true })
            .sort("-createdAt")
            .populate(["questions", "max_scores"])
            .populate({
                path: "max_scores",
                populate: ["result", "playedBy"],
            });
        res.json(quiz);
    } catch (err) {
        console.log("Error while fetching quiz!", err);
        res.status(500).json({ Message: "Error while fetching quizzes" });
    }
});

router.get("/minified", async (req, res, next) => {
    try {
        const quiz = await models.Quiz.find({ isPublic: true });
        res.json(quiz);
    } catch (err) {
        console.log("Error while fetching quiz!", err);
        res.status(500).json({ Message: "Error while fetching quizzes" });
    }
});

router.get("/get", async (req, res, next) => {
    if (!req.user) {
        res.json({ Message: "You need to login before fetching user quiz" });
    }
    try {
        const quiz = await models.Quiz.find({
            createdBy: req.user._id,
        })
            .populate(["questions", "max_scores"])
            .populate({
                path: "max_scores",
                populate: ["result", "playedBy"],
            });
        res.json(quiz);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error fetching quizzes" });
    }
});

router.get("/id/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id);
        const quiz = await models.Quiz.findById(id)
            .populate("questions")
            .populate({
                path: "max_scores",
                populate: ["result", "playedBy"],
            });
        let returnData = {
            quiz: quiz,
        };
        if (req.user) {
            const filteredArray = quiz.max_scores.filter(
                (data) => data.playedBy === req.user._id
            );
            if (filteredArray.length > 0) {
                returnData["userScored"] = true;
            } else {
                returnData["userScored"] = false;
            }
        }
        res.json(returnData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error fetching the quiz" });
    }
});

router.get("/trending", async (req, res, next) => {
    try {
        let quizzes = await models.Quiz.find({ isPublic: true })
            .sort("lastPlayed")
            .populate("questions")
            .populate({
                path: "max_scores",
                populate: ["result", "playedBy"],
            })
            .exec();
        res.json(quizzes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching quizzes!" });
    }
});

router.get("/popular", async (req, res, next) => {
    try {
        let quizzes = await models.Quiz.find({ isPublic: true })
            .sort("noOfPlays")
            .populate("questions")
            .populate({
                path: "max_scores",
                populate: ["result", "playedBy"],
            })
            .exec();
        res.json(quizzes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching quizzes!" });
    }
});

router.get("/latest", async (req, res, next) => {
    try {
        let quizzes = await models.Quiz.find({ isPublic: true })
            .sort("createdAt")
            .populate("questions")
            .populate({
                path: "max_scores",
                populate: ["result", "playedBy"],
            })
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
        let quizzes = await models.Quiz.find({
            isPublic: true,
            typeOfQuiz: category,
        })
            .populate("questions")
            .populate({
                path: "max_scores",
                populate: ["result", "playedBy"],
            })
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
    if (!req.user) {
        res.status(400).json({ Message: "Login before adding quiz" });
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
                isPublic: newQuiz.isPublic,
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
        updatedQuiz.questions.forEach((question) => {
            let quesUpdate = {
                isPublic: updatedQuiz.isPublic,
            };
            models.Question.findByIdAndUpdate(question._id, quesUpdate);
        });
        const update = {
            name: updatedQuiz.name,
            typeOfQuiz: updatedQuiz.typeOfQuiz,
            questions: updatedQuiz.questions,
            description: updatedQuiz.description,
            isPublic: updatedQuiz.isPublic,
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

// send quiz, score(body)
router.post("/played", async (req, res, next) => {
    if (!req.user) {
        res.status(400).json({
            Message: "Please login before saving gameplay",
        });
    }
    try {
        let quiz = req.body.quiz;
        const quizID = quiz._id;
        const score = req.body.score;
        const result = await models
            .Result({
                quiz: quizID,
                playedBy: req.user._id,
                score: score,
            })
            .save();
        quiz = await models.Quiz.findById(quizID).populate("max_scores");
        let quizScores = quiz.max_scores;
        if (quizScores.length > 0) {
            quizScores.push(result);
            quizScores.sort((a, b) => (a.score > b.score ? -1 : 1));
            quizScores.splice(10);
            let quizes = quizScores.map((quizScore) => quizScore._id);
            const update = {
                max_scores: quizes,
                lastPlayed: Date.now(),
                noOfPlays: quiz.noOfPlays + 1,
            };
            const updatedQuiz = await models.Quiz.findByIdAndUpdate(
                quizID,
                update
            );
            res.json(updatedQuiz);
        } else {
            quizScores = [result];
            const update = {
                max_scores: quizScores,
                lastPlayed: Date.now(),
                noOfPlays: quiz.noOfPlays + 1,
            };
            // const updatedQuiz = await models.Quiz(quizID, update);
            const updatedQuiz = await models.Quiz.findByIdAndUpdate(
                quizID,
                update
            );
            res.json(updatedQuiz);
        }

        // update leaderboard
        const user = await models.LeaderBoard.findOne({ user: req.user._id });
        let update = {};
        if (user) {
            update = {
                score: user.score + score,
                gamesPlayed: user.gamesPlayed + 1,
            };
        } else {
            update = {
                score: score,
                gamesPlayed: 1,
            };
        }

        const newUser = await models.LeaderBoard.findOneAndUpdate(
            { user: req.user._id },
            update,
            {
                new: true,
                upsert: true,
            }
        );

        console.log("Added dashboard", newUser);

        res.json(quiz);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error saving gameplay!" });
    }
});

router.get("/categories", async (req, res, next) => {
    try {
        const categories = await models.Quiz.find().distinct("category");
        res.json({ Categories: categories });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching categories" });
    }
});

router.delete("/delete/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        await models.Quiz.findByIdAndDelete(id);
        res.json({ Message: "Quiz deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while deleting quiz" });
    }
});

export default router;
