import mongoose from "mongoose"
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
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { message: "User is not logged in" },
                { status: 401 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid blog ID" },
                { status: 400 }
            );
        }

        const blogId = new mongoose.Types.ObjectId(id);
        const userId = new mongoose.Types.ObjectId(session.user.id);

        const blogDetail = await Post.aggregate([
            {
                $match: { _id: blogId },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "postId",
                    as: "likes",
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "comments"
                }
            },
            {
                $addFields: {
                    likesCount: { $size: "$likes" },
                    commentsCount: { $size: "$comments" },
                    isLiked: {
                        $in: [
                            userId,
                            {
                                $map: {
                                    input: "$likes",
                                    as: "like",
                                    in: "$$like.userId",
                                },
                            },
                        ],
                    },
                },
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    coverImg: 1,
                    tags: 1,
                    views: 1,
                    isPublished: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    isLiked: 1,
                    "userDetails._id": 1,
                    "userDetails.username": 1,
                    "userDetails.profilePic": 1
                }
            }

        ]);

        return NextResponse.json(blogDetail[0] || { message: "Blog not found" });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return NextResponse.json(
            { message: "Something went wrong", error: error.message },
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