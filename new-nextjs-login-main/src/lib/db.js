// src/lib/db.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// ADD THIS LINE BELOW:
console.log('Attempting to connect with URI:', MONGODB_URI ? MONGODB_URI.substring(0, 30) + '...' : 'URI not found'); // Log partial URI for security

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully!');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      throw new Error('Failed to connect to MongoDB');
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;