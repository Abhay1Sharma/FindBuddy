import { model } from "mongoose";
import { notificationSchema } from "../Schemas/NotificationSchema";

const Notification = mongoose.model("notification", notificationSchema);

export { Notification };