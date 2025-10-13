import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized. No active session found." },
            { status: 401 } 
        )
    }
    return NextResponse.json({
        message: "Here is the current logIn user", user 
    })
}