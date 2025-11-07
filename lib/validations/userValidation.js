import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long"),
  email: z
    .string()
    .trim()
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  bio: z
    .string()
    .max(200, "Bio must be under 200 characters")
    .optional()
    .or(z.literal("")), // allows empty bio safely
  image: z
    .string()
    .url("Invalid image URL")
    .optional()
    .or(z.literal("")), // allows empty string if no image
});


export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
  bio: z.string().max(200).optional(),
  image: z.string().optional()
});