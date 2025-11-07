import { authOptions } from "@/lib/auth";
import connectCloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { postSchema } from "@/lib/validations/postValidation";
import Post from "@/models/post";
import User from "@/models/user";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
    try {
        await connectCloudinary()
        const formData = await request.formData();
        const image = formData.get("image");

        const title = formData.get("title");
        const content = formData.get("content");
        const tagsValue = formData.get("tags");
       
        // ⭐ FIX 1: Process comma-separated tags into a clean array
        const tagsArray = tagsValue 
            ? tagsValue.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            : [];
        
        const postData = { title, content, tags: tagsArray, coverImg: "" }; // coverImg is temporary

        // Validate before uploading image
        const validated = postSchema.safeParse(postData);
        if (!validated.success) {
            // Return the detailed Zod error structure
            return NextResponse.json({ error: validated.error.flatten() }, { status: 400 });
        }

        // --- Authentication Check ---
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // --- Image Upload (only after validation passes) ---
        let coverImg = "";
        if (image) {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const uploadRes = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream((error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(buffer);
            });
            coverImg = uploadRes.secure_url;
        }

        // --- Database Insertion ---
        await connectToDatabase();
        // Assuming your User model is correctly exported and connected
        const user = await User.findById(userId);

        const newPost = await Post.create({
            title: validated.data.title, // Use validated data
            content: validated.data.content,
            tags: validated.data.tags,
            author: user._id,
            coverImg,
        });

        return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: 201 });
    } catch (error) {
        console.error("API Error:", error);
        // Ensure error details are properly handled for non-validation errors
        return NextResponse.json({ error: "Something went wrong", details: error.message }, { status: 500 });
    }
}
export async function GET(request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ message: "User not logged in" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const skip = (page - 1) * limit;

    // Simple indexed query
    const posts = await Post.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title content coverImg tags views createdAt likesCount commentsCount");

    const totalPosts = await Post.countDocuments({ isPublished: true });

    return NextResponse.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch posts", details: error.message }, { status: 500 });
  }
}
