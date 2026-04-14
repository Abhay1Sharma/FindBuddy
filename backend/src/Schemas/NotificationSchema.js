import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['LIKE', 'COMMENT', 'FOLLOW', 'CHAT'], required: true },
    postReference: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Optional: link to the post
    content: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export { notificationSchema };