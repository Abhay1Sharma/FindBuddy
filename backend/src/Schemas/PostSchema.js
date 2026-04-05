import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
    {
        about: {
            type: String,
            required: true,
        },

        media: {
            type: String,
        },
        
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user",
            required: true
        },

        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "profile",
            required: true
        }

    }, { timestamps: true }
);

export { PostSchema };