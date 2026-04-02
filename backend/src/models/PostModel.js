import { model } from "mongoose";
import { PostSchema } from "../Schemas/PostSchema";

const Post = model("post", PostSchema );

export { Post };