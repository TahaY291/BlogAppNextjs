import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "No user logged in" },
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

        const users = await User.find({}, "-password").sort({ createdAt: -1 });

        return NextResponse.json(
            {
                message: "All users fetched successfully",
                users,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            {
                message: "Failed to fetch users",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
