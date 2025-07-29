import { Router } from "express";
import { adminSignup, adminLogin } from "../controllers/admin.controller.js";
import { adminSignupSchema, adminLoginSchema } from "../validators/admin.validator.js";
import { validate } from "../middlewares/validate.js";

export const adminRoutes = Router();

adminRoutes.post('/signup', validate(adminSignupSchema, 'body'), adminSignup);
adminRoutes.post("/login", validate(adminLoginSchema, 'body'), adminLogin);