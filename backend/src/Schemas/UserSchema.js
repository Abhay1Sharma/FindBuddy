import mongoose from "mongoose";
const UserSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: false
        },

        username: {
            type: String,
            required: true,
            unique: true
        },

        googleId: {
            type: String
        },

        isVerified: {
            type: Boolean,
            default: false
        },

        hasCompleteProfile: {
            type: Boolean,
            default: false,
        },

        formId: {
            type: mongoose.Schema.Types.ObjectId,
        },

    }, { timestamp: true }
);

export { UserSchema };