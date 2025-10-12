import mongoose, { Schema, models, model } from "mongoose";

const postSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        coverImg: { type: String }, // optional
        tags: [{ type: String }], // better syntax for arrays
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        views: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Post = models?.Post || model("Post", postSchema);

export default Post;
