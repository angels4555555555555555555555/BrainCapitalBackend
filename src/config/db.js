import mongoose from "mongoose";

let connectionPromise;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI ist nicht konfiguriert");
  }

  if (mongoose.connection.readyState === 0) {
    connectionPromise = undefined;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
      serverSelectionTimeoutMS: 10_000,
    }).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  try {
    const conn = await connectionPromise;
    console.log(`MongoDB Connected Successfully!`);
    return conn.connection;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};
