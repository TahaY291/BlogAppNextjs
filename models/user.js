import mongoose, { Schema, models, model } from "mongoose";
import bcrypt from 'bcrypt'



const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: false },
    bio: { type: String, required: false },
    role: { type: String, default: "user" }
},{timestamps: true})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 10)
        } catch (error) {
            return next(error)
        }
    }
    next()
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


const User = models?.User || model("User", userSchema)

export default User