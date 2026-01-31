const mongoose = require('mongoose');

// Use global to cache the connection across serverless function calls
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If a connection already exists, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If no promise exists, create one
  if (!cached.promise) {
    const opts = {
      // Allow Mongoose to buffer commands for a short time if the connection 
      // isn't ready. This prevents "bufferCommands = false" errors.
      bufferCommands: true, 
      // How long to wait for a server to be selected before failing
      serverSelectionTimeoutMS: 5000, 
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log('=> New database connection established');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection fails, clear the promise so we can try again on the next request
    cached.promise = null;
    console.error('=> MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;