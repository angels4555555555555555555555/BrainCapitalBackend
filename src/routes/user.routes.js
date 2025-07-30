import { Router } from "express";
import { userLogin, userLogout, getUserProfileData, updateUserProfilePicture } from "../controllers/user.controller.js";
import { userLoginSchema } from "../validators/user.validator.js";
import { validate } from "../middlewares/validate.js";

import { authenticateUserToken } from "../middlewares/auth.js";
import { userAuthorization } from "../middlewares/authorization.js";
import { upload } from "../middlewares/multer.js";

export const userRoutes = Router();

userRoutes.post("/login", validate(userLoginSchema, 'body'), userLogin);
userRoutes.post("/logout", authenticateUserToken, userLogout);

userRoutes.get("/getProfile", authenticateUserToken, userAuthorization, getUserProfileData);
userRoutes.patch("/updateProfilePicture", authenticateUserToken, userAuthorization, upload, updateUserProfilePicture);
