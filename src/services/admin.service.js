import Admin from "../models/Admin.js";
import { hashPassword, verifyPassword } from "../utils/hashPassword.js";
import { generateAuthToken } from "../utils/jwt.js";

export const signup = async (email, password) => {
    try {
        const hash = await hashPassword(password);
        await Admin.create({ email, password: hash});
    } catch (err) {
        throw err;
    }
};

export const login = async (email, password) => {
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            throw new Error("Invalid admin email or password");
        }
        const isPasswordValid = await verifyPassword(password, admin.password);
        if (!isPasswordValid) {
            throw new Error("Invalid admin email or password");
        }

        const token = generateAuthToken(admin._id, admin.email, true);
        return token;
        
    } catch (err) {
        throw err;
    }
};