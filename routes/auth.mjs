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
    res.send(req.user);
});

router.get('/signup', async (req, res, next) => {
    
});

router.get('/login', async (req, res, next) => {
    res.send('Email login');
})

router.get('/logout', async (req, res, next) => {
    req.logout();
    req.session = null;
    req.sessionOptions.maxAge = 0;
    res.json({Message: "Logged out user"});
})

export default router;