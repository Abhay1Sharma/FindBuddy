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
            required: true
        },

    }, { timestamps: true }
);

export { PostSchema };