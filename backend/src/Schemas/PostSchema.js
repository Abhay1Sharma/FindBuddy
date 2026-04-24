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
            ref: "user",
            required: true
        },

        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "profile",
            required: true
        },

        isPostSave: {
            type: Boolean,
            default: false,
        },

        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }],

        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },

        isRepost: {
            type: Boolean,
            dafault: false
        },

        isEdited: {
            type: Boolean,
            default: false,
        }

    }, { timestamps: true }
);

export { PostSchema };