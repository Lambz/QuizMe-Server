import express from 'express';
import {connectDB} from './db/db_main.mjs';
import dotenv from 'dotenv';

const app = express();
const router = express.Router();
const env_init = dotenv.config();

if(env_init.error) {
    console.log("\nError while loading env vars...\nError: ", env_init.error);
}

const PORT = process.env.PORT || 3000;
//app crash loggging code middleware

app.get('', async (req, res, next) => {
    res.json({"Message": "Welcome to QuizMe Server"});
})

connectDB().then(async() => {
    app.listen(PORT, () => {
        console.log("\nServer running at port ", PORT);
    });
});
