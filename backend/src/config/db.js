import mongoose from "mongoose";

let connected = false;

/**
 * Connect to MongoDB. Non-fatal: if the URI is missing or the connection
 * fails, we log a warning and continue so that stateless routes (e.g. /api/plan)
 * keep working. Auth/trip routes guard on `isDbConnected()` and return 503.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("⚠️  MONGODB_URI not set — auth & saved trips are disabled.");
    return false;
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    connected = true;
    console.log("✅ MongoDB connected");
    return true;
  } catch (err) {
    console.warn(`⚠️  MongoDB connection failed: ${err.message}`);
    console.warn("   Auth & saved trips are disabled until the DB is reachable.");
    return false;
  }
}

export function isDbConnected() {
  return connected && mongoose.connection.readyState === 1;
}
