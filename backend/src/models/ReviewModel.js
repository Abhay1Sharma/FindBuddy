import { model } from "mongoose";

import { ReviewSchema } from "../Schemas/ReviewSchema.js";

const Review = model("review", ReviewSchema);

export { Review };