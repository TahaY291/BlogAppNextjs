import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import Like from "@/models/likes"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        await connectToDatabase()
        const { postId } = await request.json()

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized: Please log in first" },
                { status: 401 }
            );
        }

        const userId = session.user.id
        const existingLike = await Like.findOne({ userId, postId });
        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            return NextResponse.json({ liked: false, message: "Post unliked" }, { status: 200 });
        }

        await Like.create({ userId, postId });
        return NextResponse.json({ liked: true, message: "Post liked" }, { status: 200 });
    } catch (error) {
        console.log(error, "failed to like the post")
        return NextResponse.json({
            err: "Failed to like the blog"
        }, {status: 500})
    }
}