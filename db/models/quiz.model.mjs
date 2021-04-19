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
                // NOTE: top 10/20 scores stored here
                // if user among them then additional field added at the end
                user: {
                    type: mongoose.Schema.Types.String,
                    ref: "User",
                },
                score: Number,
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
