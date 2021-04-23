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
        const user = await models.User.findById(userID)
            .populate(["inviteSent", "inviteReceived"])
            .populate({
                path: "inviteReceived",
                populate: ["from", "to", "quiz"],
            });
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

router.get("/inviteReceived", async (req, res, next) => {
    console.log("req.header: ", req.headers);
    if (!req.user) {
        res.status(400).json({ Message: "Login before fetching details" });
    }
    try {
        const userID = req.user._id;
        const user = await models.User.findById(userID)
            .populate("inviteReceived")
            .populate({
                path: "inviteReceived",
                populate: ["from", "to", "quiz"],
            })
            .populate({
                path: "inviteReceived",
                populate: {
                    path: "quiz",
                    populate: ["questions", "max_scores"],
                },
            })
            .populate({
                path: "inviteReceived",
                populate: {
                    path: "quiz",
                    populate: {
                        path: "max_scores",
                        populate: "playedBy",
                    },
                },
            });
        const invites = user.inviteReceived.filter(
            (invite) => !invite.accepted
        );
        res.json(invites);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching user" });
    }
});

router.get("/acceptInvite/:id", async (req, res, next) => {
    console.log("req.header: ", req.headers);
    if (!req.user) {
        res.status(400).json({ Message: "Login before fetching details" });
    }
    try {
        const invite = await models.Invite.findByIdAndUpdate(req.params.id, {
            accepted: true,
        });
        res.json(invite);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching user" });
    }
});

router.get("/inviteSent", async (req, res, next) => {
    console.log("req.header: ", req.headers);
    if (!req.user) {
        res.status(400).json({ Message: "Login before fetching details" });
    }
    try {
        const userID = req.user._id;
        const user = await models.User.findById(userID)
            .populate("inviteSent")
            .populate({
                path: "inviteSent",
                populate: ["to", "quiz"],
            })
            .populate({
                path: "inviteSent",
                populate: {
                    path: "quiz",
                    populate: ["questions", "max_scores"],
                },
            })
            .populate({
                path: "inviteSent",
                populate: {
                    path: "quiz",
                    populate: {
                        path: "max_scores",
                        populate: "playedBy",
                    },
                },
            });
        let results = [];
        for (let i = 0; i < user.inviteSent.length; i++) {
            let result = {
                name: user.inviteSent[i].to.name,
                accepted: user.inviteSent[i].accepted,
                createdAt: user.inviteSent[i].createdAt,
                updatedAt: user.inviteSent[i].updatedAt,
                quiz: user.inviteSent[i].quiz,
            };
            if (user.inviteSent[i].accepted && user.inviteSent[i].to != null) {
                let x = await models.Result.find({
                    quiz: user.inviteSent[i].quiz,
                    playedBy: user.inviteSent[i].to._id,
                })
                    .sort({ createdAt: "descending" })
                    .limit(1);
                if (x.length > 0) {
                    result["score"] = x[0].score;
                } else {
                    result["score"] = "Not Played yet";
                }
            }
            results.push(result);
        }
        res.json(results);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching user" });
    }
});

router.get("/results", async (req, res, next) => {
    console.log("req.header: ", req.headers);
    if (!req.user) {
        res.status(400).json({ Message: "Login before fetching details" });
    }
    try {
        const userID = req.user._id;
        const result = await models.Result.find({ playedBy: userID })
            .populate("quiz")
            .populate({ path: "quiz", populate: ["max_scores", "questions"] })
            .populate({
                path: "quiz",
                populate: { path: "max_scores", populate: "playedBy" },
            });
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Message: "Error while fetching user" });
    }
});

router.post('/sendInvite', async (req, res, next) => {
    if(!req.user) {
        res.status(400).json({Message: "Login before sending challenge"})
    }
    try {
        const invite = await models.Invite({
            from: req.user._id,
            to: req.body.sendTo,
            quiz: req.body.quiz,
            accepted: false
        }).save();
        const sender = await models.User.findById(req.user._id);
        let invites = sender.inviteSent;
        invites.push(invite._id);
        await models.User.findByIdAndUpdate(req.user._id, {inviteSent: invites});
        const sendTo = await models.User.findById(req.body.sendTo);
        invites = sender.inviteReceived;
        invites.push(invite._id);
        await models.User.findByIdAndUpdate(req.body.sendTo, {inviteSent: invites});
        res.json({Message: true});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({Message: false});
    }
})

export default router;
