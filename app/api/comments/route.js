import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { commentSchema } from "@/lib/validations/commentValidation";
import Comment from "@/models/comments";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDatabase();

        const body = await request.json();
        const validated = commentSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validated.error.flatten(),
                },
                { status: 400 }
            );
        }

        const { comment, postId } = validated.data;

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first" },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const newComment = await Comment.create({
            userId,
            postId,
            comment,
        });

        return NextResponse.json(
            {
                message: "Comment added successfully",
                comment: newComment,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json(
            { message: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
