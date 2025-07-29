import { Router } from "express";
import { userSignup, userLogin } from "../controllers/user.controller.js";
import { userSignupSchema, userLoginSchema } from "../validators/user.validator.js";
import { validate } from "../middlewares/validate.js";

export const userRoutes = Router();

userRoutes.post('/signup', validate(userSignupSchema, 'body'), userSignup);
userRoutes.post("/login", validate(userLoginSchema, 'body'), userLogin);