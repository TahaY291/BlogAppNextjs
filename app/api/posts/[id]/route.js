import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Post from "@/models/post";
import connectCloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { updatePostSchema } from "@/lib/validations/postValidation";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        if (post.author.toString() !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await Post.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Post deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete post", details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request, { params }) {
    try {
        await connectToDatabase();

        const { id } = params;
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Post fetched successfully", post },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch post", details: error.message }, 
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        await connectCloudinary();
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        if (!id) {
            return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
        }

        const formData = await request.formData();
        const postData = {
            title: formData.get("title"),
            content: formData.get("content"),
            tags: formData.get("tags"),
        };

        const validated = updatePostSchema.safeParse(postData);
        if (!validated.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validated.error.flatten() },
                { status: 400 }
            );
        }

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        if (post.author.toString() !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const image = formData.get("image");
        let uploadRes = null;

        if (image) {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            uploadRes = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream((error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    })
                    .end(buffer);
            });

            post.coverImg = uploadRes.secure_url;
        }

        if (validated.data.title) post.title = validated.data.title;
        if (validated.data.content) post.content = validated.data.content;
        if (validated.data.tags)
            post.tags = validated.data.tags.split(",").map((tag) => tag.trim());

        await post.save();

        return NextResponse.json(
            { message: "Post updated successfully", post },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json(
            { message: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}