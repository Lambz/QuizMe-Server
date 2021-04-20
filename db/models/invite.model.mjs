import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.String,
            ref: "User",
        },
        to: {
            type: mongoose.Schema.Types.String,
            ref: "User",
        },
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
        },
        accepted: Boolean,
    },
    { timestamps: true }
);

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;
