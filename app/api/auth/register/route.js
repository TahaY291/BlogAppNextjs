import connectCloudinary from '@/lib/cloudinary'
import { connectToDatabase } from '@/lib/db'
import { registerSchema } from '@/lib/validations/userValidation'
import User from '@/models/user'
import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    await connectCloudinary()
    await connectToDatabase()

    const formData = await request.formData()
    const image = formData.get('image')

    let uploadRes = null
    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((error, result) => {
          if (error) reject(error)
          else resolve(result)
        }).end(buffer)
      })
    }

    const userData = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      bio: formData.get('bio') || "", // optional
      image: uploadRes ? uploadRes.secure_url : "" // optional
    }

    const validated = registerSchema.safeParse(userData)
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      )
    }

    const userAlreadyExist = await User.findOne({ email: userData.email })
    if (userAlreadyExist) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 401 })
    }

    const user = await User.create(userData)

    return NextResponse.json({ message: 'User registered successfully', user }, { status: 201 })
  } catch (error) {
    console.error('Error in register route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
