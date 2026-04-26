import { Schema, mongoose } from "mongoose";

const ConnectionSchema = new Schema(
    {
        isConnected: {
            type: Boolean,
            default: false,
        },

        connectedFrom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            require: true,
        },

        connectedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },

        isAnyRequest: {
            type: Boolean,
            default: false,
        },

        requestFrom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    }, { timestamps: true}
)

export { ConnectionSchema };