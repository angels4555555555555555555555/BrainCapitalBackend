import User from "../models/User.js";
import { hashPassword } from "../utils/hashPassword.js";

export const signup = async ({ email, password, firstName, lastName, dob, gender, country, shares }) => {
    try {
        const hash = await hashPassword(password);
        await User.create({ email, password: hash, firstName, lastName, dob, gender, country, shares });
    } catch (err) {
        throw err;
    }
};

export const login = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!admin) {
            throw new Error("Invalid user email or password");
        }
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid user email or password");
        }

        const token = generateAuthToken(user._id, user.email, false);
        return token;
        
    } catch (err) {
        throw err;
    }
};