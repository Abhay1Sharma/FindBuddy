import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema(
    {
        rating: {
            type: Number,
            default: 1,
            min: 1,
            max: 5,
        },

        review: {
            type: String,
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },

        reviewUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },

        username: {
            type: String,
            required: true,
        },

        profileImage: {
            type: String,
            required: true,
        },

        isEdited: {
            type: Boolean,
            default: false,
        }

    }, { timestamps: true }
);

export { ReviewSchema };