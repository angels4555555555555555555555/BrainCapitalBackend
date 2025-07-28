import mongoose from "mongoose";    

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    });
    // console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Connected Successfully!`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1); // Exit process with failure
  }
};