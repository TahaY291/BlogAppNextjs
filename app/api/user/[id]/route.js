import { authOptions } from "@/lib/auth";
import connectCloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { updateUserSchema } from "@/lib/validations/userValidation";
import Post from "@/models/post";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
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

        const userRole = session.user.role;
        if (userRole !== "admin") {
            return NextResponse.json(
                { message: "Forbidden: Admin access only" },
                { status: 403 }
            );
        }

        if (!id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { message: "Something went wrong", error: error.message },
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

        if (!id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        const user = await User.findById(id).select("username email image bio role createdAt");
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 5;
        const skip = (page - 1) * limit;

        const authorId = new mongoose.Types.ObjectId(id);
        const loggedInUserId = new mongoose.Types.ObjectId(session.user.id);

        const posts = await Post.aggregate([
            {
                $match: { author: authorId },
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
                    as: "comments",
                },
            },
            {
                $addFields: {
                    likesCount: { $size: "$likes" },
                    commentsCount: { $size: "$comments" },
                    isLiked: {
                        $in: [
                            loggedInUserId,
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
                    createdAt: 1,
                    updatedAt: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    isLiked: 1,
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ]);

        const totalPosts = await Post.countDocuments({ author: authorId });

        return NextResponse.json(
            {
                message: "User fetched successfully",
                user,
                posts,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalPosts / limit),
                    totalPosts,
                    limit,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            {
                message: "Something went wrong",
                error: error.message,
            },
            { status: 500 }
        );
    }
}


export async function PUT(request, { params }) {
    try {
        await connectCloudinary();
        await connectToDatabase();

        const { id } = params;
        if (!id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const userData = {
            username: formData.get("username"),
            password: formData.get("password"),
            bio: formData.get("bio"),
        };

        const validated = updateUserSchema.safeParse(userData);
        if (!validated.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validated.error.flatten(),
                },
                { status: 400 }
            );
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
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (validated.data.username) user.username = validated.data.username;
        if (validated.data.password) user.password = validated.data.password;
        if (validated.data.bio) user.bio = validated.data.bio;
        if (uploadRes) user.image = uploadRes.secure_url;

        await user.save();

        return NextResponse.json(
            {
                message: "User updated successfully",
                user,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { message: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}