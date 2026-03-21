import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastConnectionTime: number | null;
  connectionAttempts: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
  lastConnectionTime: null,
  connectionAttempts: 0,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  // If we have a connection, return it
  if (cached.conn) {
    console.log('✅ Using existing MongoDB connection');
    return cached.conn;
  }

  // If we're already connecting, wait for it
  if (cached.promise) {
    console.log('⏳ Waiting for existing MongoDB connection...');
    cached.conn = await cached.promise;
    return cached.conn;
  }

  console.log('🔄 Connecting to MongoDB...');

  // Create new connection promise
  cached.promise = mongoose
    .connect(MONGODB_URI!, {
      // Connection options
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    })
    .then((mongoose) => {
      console.log('✅ Successfully connected to MongoDB');
      return mongoose;
    })
    .catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);

      // Handle specific error types
      if (error.code === 'ENOTFOUND') {
        console.error('❌ DNS resolution failed. Check your MongoDB URI hostname.');
      } else if (error.code === 'ECONNREFUSED') {
        console.error('❌ Connection refused. Check if MongoDB server is running and accessible.');
      } else if (error.code === 'ETIMEDOUT') {
        console.error('❌ Connection timed out. Check network connectivity and MongoDB server status.');
      } else if (error.name === 'MongoServerError' && error.code === 8000) {
        console.error('❌ Authentication failed. Check username/password in MongoDB URI.');
      }

      // Reset cache on failure
      cached.promise = null;
      throw error;
    });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    // Reset promise on any error
    cached.promise = null;
    throw error;
  }
}

export default dbConnect;
