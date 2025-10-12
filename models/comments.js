import mongoose, { Schema, models, model } from "mongoose";

const CommentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true }, // ✅ Fix ref name
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Comment = models?.Comment || model("Comment", CommentSchema);

export default Comment;
