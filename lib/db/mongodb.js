import mongoose from "mongoose"

// 檢查是否在服務器端運行
const isServer = typeof window === "undefined"

if (!isServer) {
  console.warn("Attempting to use MongoDB connection on client side")
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (!isServer) {
    console.error("Cannot connect to MongoDB from client side")
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("Connected to MongoDB")
        return mongoose
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error)
        throw error
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectToDatabase

