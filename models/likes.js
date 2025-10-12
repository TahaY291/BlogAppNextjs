import mongoose, { Schema, models, model } from "mongoose";

const LikeSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true }, // ✅ Fix ref name
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Like = models?.Like || model("Like", LikeSchema);

export default Like;
