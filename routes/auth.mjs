import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/', async (req, res, next) => {
    res.json({Message: "Login Here"});    
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/google/redirect', passport.authenticate('google'), async (req, res, next) => {
    res.send("Logged in");
});

router.get('/signup', async (req, res, next) => {
    
});

router.get('/login', async (req, res, next) => {
    res.send('Email login');
})

router.get('/logout', async (req, res, next) => {
    res.json({Message: "Looged out user"});
})

export default router;