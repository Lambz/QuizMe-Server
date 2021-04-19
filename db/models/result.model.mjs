import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
        },
        playedBy: {
            type: mongoose.Schema.Types.String,
            ref: "User",
        },
        score: Number,
    },
    { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;
