import mongoose from 'mongoose'


const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env")
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10
        }

        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
            console.log("Mongodb connected successgfuly")
            return mongoose
        }).catch(error => {
            console.error("Mongdb connection err", error)
            throw error
        })
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}