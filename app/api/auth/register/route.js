import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import connectCloudinary from "@/lib/cloudinary";
import { registerSchema } from "@/lib/validations/userValidation";
import User from "@/models/user";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request) {
  try {
    await connectCloudinary();
    await connectToDatabase();

    const formData = await request.formData();
    const image = formData.get("image");

    // Step 1: Upload image if present
    let imageUrl = "";
    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "users" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    // Step 2: Prepare user data
    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      bio: formData.get("bio") || "",
      image: imageUrl,
    };

    // Step 3: Validate data
    const validated = registerSchema.safeParse(userData);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    // Step 4: Check for existing user
    const existingUser = await User.findOne({ email: validated.data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Step 5: Create new user
    const newUser = await User.create(validated.data);

    // Step 6: Exclude password from response
    const { password, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in register route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
