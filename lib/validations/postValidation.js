import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  content: z.string().min(20, "Content must be at least 20 characters long"),
  coverImg: z.string().url("Invalid image URL").optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});
