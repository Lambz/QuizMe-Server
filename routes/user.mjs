import express from "express";
import models from "../db/db_main.mjs";

const router = express.Router();

router.get("/", async (req, res, next) => {
    console.log("req.header: ", req.headers);
    if (!req.user) {
        res.status(400).json({ Message: "Login before fetching details" });
    }
    try {
        const userID = req.user._id;
        const user = await models.User.findById(userID);
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching user" });
    }
});

router.get("/all", async (req, res, next) => {
    try {
        const users = await models.User.find().populate([
            "inviteSent",
            "inviteReceived",
        ]);
        res.json(users);
    } catch (err) {
        console.log("Error fetching users.\n", err);
        res.json({ Message: "Error fetching users" });
    }
});

router.post("/search", async (req, res, next) => {
    try {
        const users = await models.User.find({
            name: { $regex: req.body.text, $options: "i" },
        });
        users.sort((a, b) => (a.name > b.name ? 1 : -1));
        res.json(users);
    } catch (err) {
        console.log("Error fetching users.\n", err);
        res.json({ Message: "Error fetching users" });
    }
});

router.post("/challenge", async (req, res, next) => {
    if (!req.user) {
        res.status(400).json({ Message: "Login before fetching details" });
    }
    try {
        const invite = await models
            .Invite({
                from: req.user._id,
                to: req.body.challengee,
                quiz: req.body.quiz,
                accepted: false,
            })
            .save();
        const from = await models.User.findByIdAndUpdate(req.user._id, {
            $push: { inviteSent: invite._id },
        });
        const to = await models.User.findByIdAndUpdate(req.body.challengee, {
            $push: { inviteReceived: invite._id },
        });
        res.json({ Success: true });
    } catch (err) {
        console.log("Error fetching users.\n", err);
        res.json({ Message: "Error fetching users" });
    }
});

export default router;
