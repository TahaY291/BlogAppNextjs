import connectCloudinary from '@/lib/cloudinary'
import { connectToDatabase } from '@/lib/db'
import { registerSchema } from '@/lib/validations/userValidation'
import User from '@/models/user'
import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

export async function POST(request) {
    try {
        await connectCloudinary()

        const formData = await request.formData()
        const image = await formData.get('image')

        if (!image) {
            return NextResponse.json(
                { error: "Image file is required" },
                { status: 400 }
            );
        }

        const arrayBuffer = await image.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const uploadRes = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream((error, result) => {
                if (error) reject(error)
                else resolve(result)
            }).end(buffer)
        })

        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            bio: formData.get('bio'),
            image: uploadRes.secure_url
        }

        const validated = registerSchema.safeParse(userData);
        if (!validated.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validated.error.flatten()
                },
                { status: 400 }
            );
        }

        await connectToDatabase()
        const userAlreadyExist = await User.findOne({ email: userData.email })
        if (userAlreadyExist) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 401 })
        }

        const user = await User.create(userData)

        return NextResponse.json(
            { message: 'User registered successfully', user },
            { status: 201 })
    } catch (error) {
        console.error('Error in register route:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}