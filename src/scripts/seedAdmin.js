import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Admin from "../models/Admin.js";
import { hashPassword } from "../utils/hashPassword.js";

dotenv.config();

const email = (process.env.ADMIN_SEED_EMAIL || "admin@braincapitalasset.com")
  .trim()
  .toLowerCase();
const password = process.env.ADMIN_SEED_PASSWORD;

if (!password) {
  throw new Error("ADMIN_SEED_PASSWORD ist erforderlich");
}

if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
  throw new Error(
    "ADMIN_SEED_PASSWORD muss mindestens 8 Zeichen, einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten"
  );
}

try {
  await connectDB();
  const passwordHash = await hashPassword(password);
  const existingAdmin = await Admin.exists({ email });

  await Admin.updateOne(
    { email },
    { $set: { password: passwordHash }, $setOnInsert: { email } },
    { upsert: true, runValidators: true }
  );

  console.log(
    existingAdmin
      ? `Admin aktualisiert: ${email}`
      : `Admin erstellt: ${email}`
  );
} finally {
  await mongoose.disconnect();
}
