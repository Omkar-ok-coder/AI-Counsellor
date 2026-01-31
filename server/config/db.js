const mongoose = require('mongoose');

/** * Global is used here to maintain a cached connection across hot reloads
 * in development and across function executions in Vercel.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // 1. If we have a connection, and it's actually "connected" (readyState 1)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // 2. If no promise exists, start the connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // MUST be true to prevent your current error
      serverSelectionTimeoutMS: 10000, // Give Atlas more time to respond
      socketTimeoutMS: 45000,
    };

    console.log("=> Initializing new MongoDB connection...");
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongooseInstance) => {
      console.log("=> MongoDB connected successfully.");
      return mongooseInstance;
    });
  }

  try {
    // 3. Force the code to wait until the promise is fully resolved
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on failure so we can retry
    console.error("=> MongoDB connection failed:", e.message);
    throw new Error("Database connection could not be established.");
  }

  return cached.conn;
}

module.exports = connectDB;