import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const requiredEnvironment = ["MONGO_URI", "JWT_SECRET", "PASSWORD_ENCRYPTION_KEY"];
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name]);

if (missingEnvironment.length) {
  throw new Error(`Fehlende Umgebungsvariablen: ${missingEnvironment.join(", ")}`);
}

if (!/^[a-fA-F0-9]{64}$/.test(process.env.PASSWORD_ENCRYPTION_KEY)) {
  throw new Error("PASSWORD_ENCRYPTION_KEY muss ein 64-stelliger Hexadezimalwert sein");
}

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
