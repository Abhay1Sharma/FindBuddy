import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
    {
        about: {
            type: String,
            required: true,
        },

        media: {
            type: String,
        }
    }, { timeStamps: true }
);

export { PostSchema };