import { Router } from "express";
import { adminSignup, adminLogin, adminCheckAuthStatus, getAdminProfileData, adminChangePassword, adminGetUsers, adminGetUser, adminSearchUsers, adminCreateUser, adminLogout, adminDeleteUser, adminUpdateUser, updateAdminProfilePicture, revealUserPassword, retrieveKlarnaPrice, changeKlarnaPrice } from "../controllers/admin.controller.js";
import { signupSchema, loginSchema, changePasswordSchema, getUsersScehma, searchUsersScehma, createUserSchema, updateUserSchema, deleteUsersSchema, userIdSchemaParams, updateKlarnaPriceSchema } from "../validators/admin.validator.js";
import { validate } from "../middlewares/validate.js";

import { authenticateAdminToken } from "../middlewares/auth.js";
import { adminAuthorization } from "../middlewares/authorization.js";
import { upload } from "../middlewares/multer.js";

export const adminRoutes = Router();

adminRoutes.post('/signup', validate(signupSchema, 'body'), adminSignup);
adminRoutes.post("/login", validate(loginSchema, 'body'), adminLogin);
adminRoutes.post("/logout", authenticateAdminToken, adminLogout);
adminRoutes.get("/checkAuthStatus", authenticateAdminToken, adminCheckAuthStatus);

adminRoutes.patch("/updateProfilePicture", authenticateAdminToken, adminAuthorization, upload, updateAdminProfilePicture);
adminRoutes.patch("/changePassword", authenticateAdminToken, adminAuthorization, validate(changePasswordSchema, 'body'), adminChangePassword);
adminRoutes.get("/getProfile", authenticateAdminToken, adminAuthorization, getAdminProfileData);

adminRoutes.get("/getUser/:id", authenticateAdminToken, adminAuthorization, validate(userIdSchemaParams, 'params'), adminGetUser);
adminRoutes.post("/createUser", authenticateAdminToken, adminAuthorization, validate(createUserSchema, 'body'), adminCreateUser);
adminRoutes.patch("/updateUser", authenticateAdminToken, adminAuthorization, validate(updateUserSchema, 'body'), adminUpdateUser);
adminRoutes.patch("/deleteUser", authenticateAdminToken, adminAuthorization, validate(deleteUsersSchema, 'body'), adminDeleteUser);
adminRoutes.get("/revealPassword/:id", authenticateAdminToken, adminAuthorization, validate(userIdSchemaParams, 'params'), revealUserPassword);

adminRoutes.get("/getUsers", authenticateAdminToken, adminAuthorization, validate(getUsersScehma, 'query'), adminGetUsers);
adminRoutes.get("/searchUsers", authenticateAdminToken, adminAuthorization, validate(searchUsersScehma, 'query'), adminSearchUsers);

adminRoutes.get("/retrieveKlarnaPrice", authenticateAdminToken, adminAuthorization, retrieveKlarnaPrice);
adminRoutes.patch("/changeKlarnaPrice", authenticateAdminToken, adminAuthorization, validate(updateKlarnaPriceSchema, 'body'), changeKlarnaPrice);