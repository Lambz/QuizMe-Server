import express from 'express';
import passport from 'passport';
import models from '../db/db_main.mjs';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/', async (req, res, next) => {
    res.json({Message: "Login Here"});    
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), async (req, res, next) => {
    res.send(req.user);
});

router.post('/signup', async (req, res, next) => {
    try {
        const password = await bcrypt.hash(req.body.password, 10);
        const user = await models.User({
            _id: req.body.email,
            name: req.body.name,
            password: password,
            quizTaken: 0
        }).save();
        res.body = user;
        res.status(201).json(user);
    }
    catch(err) {
        console.log("Error adding user!\nError: ", err);
        res.status(500).json({Message:"Error Adding User"});
    }
});

router.post('/login', passport.authenticate('local'), async (req, res, next) => {
    res.send(req.user);
})

router.get('/logout', async (req, res, next) => {
    req.logout();
    req.session = null;
    req.sessionOptions.maxAge = 0;
    res.json({Message: "Logged out user"});
})

export default router;