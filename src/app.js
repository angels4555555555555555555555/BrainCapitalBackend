// Importing all the required modules
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

// Importing the routes
import { adminRoutes } from "./routes/admin.routes.js";
import { userRoutes } from "./routes/user.routes.js";


// Configuring the environment variables
dotenv.config();

// Creating the express app
const app = express();

// Using the middlewares
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// allowed cors origins
const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://www.sk-blackrock-financial.com",
  "https://www.ectus-verwaltungs-ag.com",
  "https://www.brain-capital-asset.com",
  "https://brain-capital-frontend.vercel.app"
];
const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        // Not allowed by CORS
        callback(new Error("Von CORS nicht erlaubt"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Using the routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.get("/api/testing", (req, res) => res.send("Hello World, Testing APIs"));

app.use((req, res) => {
  res.status(404).json({ message: "API-Endpunkt nicht gefunden" });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.message === "Von CORS nicht erlaubt") {
    return res.status(403).json({ message: err.message });
  }
  return res.status(err.status || 500).json({
    message: process.env.NODE_ENV === "production" ? "Interner Serverfehler" : err.message,
  });
});

export default app;
