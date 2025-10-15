import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Comment from "@/models/comments";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        await connectToDatabase();

        const { id } = params;
        const { comment } = await request.json()
        
                if (!id) {
                    return NextResponse.json({ message: "Comment ID is required" }, { status: 400 });
                }

        if (!comment || comment.trim() === "") {
            return NextResponse.json(
                { message: "Comment cannot be empty" },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first" },
                { status: 401 }
            );
        }

        const loggedUserId = session.user.id;

        const oldComment = await Comment.findById(id);
        if (!oldComment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        if (loggedUserId !== oldComment.userId.toString()) {
            return NextResponse.json(
                { message: "Forbidden: You are not allowed to update this comment" },
                { status: 403 }
            );
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { comment },
            { new: true }
        );

        return NextResponse.json(
            { message: "Comment updated successfully", updatedComment },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json(
            { error: "Something went wrong", details: error.message },
            { status: 500 }
        );
    }
}
export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();

        const { id } = params;
        if (!id) {
            return NextResponse.json({ message: "Comment ID is required" }, { status: 400 });
        }

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first" },
                { status: 401 }
            );
        }

        const loggedUserId = session.user.id;
        const userRole = session.user.role;

        const comment = await Comment.findById(id);
        if (!comment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        if (loggedUserId !== comment.userId.toString() && userRole !== "admin") {
            return NextResponse.json(
                { message: "Forbidden: You are not allowed to delete this comment" },
                { status: 403 }
            );
        }

        await Comment.findByIdAndDelete(id);

        return NextResponse.json(
            { message: "Comment deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json(
            { error: "Something went wrong", details: error.message },
            { status: 500 }
        );
    }
}
