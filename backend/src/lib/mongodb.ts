import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: MongooseCache = { conn: null, promise: null };

async function dbConnect(): Promise<typeof mongoose> {
  const mongodbUri = process.env.MONGODB_URI || "";

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not configured. Set it in .env file.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  console.log("[MongoDB] Connecting...");
  cached.promise = mongoose.connect(mongodbUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
  });

  try {
    cached.conn = await cached.promise;
    console.log("[MongoDB] Connected successfully");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}

export default dbConnect;
