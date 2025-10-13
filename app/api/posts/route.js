import { authOptions } from "@/lib/auth";
import connectCloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { postSchema } from "@/lib/validations/postValidation";
import Post from "@/models/post";
import User from "@/models/user";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        await connectCloudinary();
        const formData = await request.formData();
        const image = formData.get("image");


        if (!image) {
            return NextResponse.json({ error: "Image file is required" }, { status: 400 });
        }


        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadRes = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream((error, result) => {
                if (error) reject(error);
                else resolve(result);
            }).end(buffer);
        });

        const postData = {
            title: formData.get("title"),
            content: formData.get("content"),
            tags: formData.get("tags"),
            coverImage: uploadRes.secure_url,
        };

        const validated = postSchema.safeParse(postData);
        if (!validated.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validated.error.flatten()
                },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userId);

        const newPost = await Post.create({
            title: validated.data.title,
            content: validated.data.content,
            tags: validated.data.tags,
            author: user._id,
            coverImage: uploadRes.secure_url,
        });

        return NextResponse.json(
            {
                message: "Post created successfully",
                post: newPost,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong", details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectToDatabase()
        const posts = await Post.find({})
        return NextResponse.json({
            message: "All the posts are successfuly fetched", posts
        }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch posts", details: error.message },
            { status: 500 }
        );
    }
}