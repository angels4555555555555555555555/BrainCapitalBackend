// Importing all the required modules
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
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
const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Using the routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.get("/api/testing", (req, res) => res.send("Hello World, Testing API!"));

export default app;
