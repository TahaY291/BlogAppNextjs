import { z } from "zod";

export const commentSchema = z.object({
  comment: z.string().min(1, "Comment cannot be empty").max(500, "Comment too long"),
  postId: z.string(),
});
