import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import connectCloudinary from "@/lib/cloudinary";
import { v2 as cloudinary } from "cloudinary";
import User from "@/models/user";

export async function PATCH(request) {
  try {
    await connectToDatabase();
    await connectCloudinary();

    // Get the logged-in user's session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const bio = formData.get("bio");
    const image = formData.get("image");

    const updateData = {};

    if (bio) updateData.bio = bio;

    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      });

      updateData.image = uploadRes.secure_url;
    }

    // Update the user by email (from session)
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
