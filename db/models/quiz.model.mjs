import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
    {
        name: String,
        typeOfQuiz: Number,
        questions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
        max_scores: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Result",
            },
        ],
        description: String,
        lastPlayed: Date,
        noOfPlays: Number,
        createdBy: {
            type: mongoose.Schema.Types.String,
            ref: "User",
        },
        isPublic: Boolean,
    },
    { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
