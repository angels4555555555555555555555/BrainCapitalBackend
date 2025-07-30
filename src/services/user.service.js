import User from "../models/User.js";
import { hashPassword } from "../utils/hashPassword.js";
import { uploadSingleImage, deleteSingleImage } from "../utils/imageUpload.js";
import { getKlarnaPrice } from "../utils/klarnaPrice.js";

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

export const updateProfilePicture = async (user, filePath) => {
    try
    {
        if(user.profilePicture && user.profilePicture.publicId && user.profilePicture.publicId !== "")
        {
            await deleteSingleImage(user.profilePicture.publicId);
        }

        const result = await uploadSingleImage(filePath);

        await User.findByIdAndUpdate(user._id, { profilePicture: { url: result.url, publicId: result.publicId }});

    }
    catch(err)
    {
        throw err;
    }
};

export const getProfileData = async (userId) => {
    try {
        const user = await User.findById(userId).select("-password -encryptedPassword").lean();
        if (!user) {
            throw new Error("User not found");
        }

        const klarnaPrice = await getKlarnaPrice();

        if (!klarnaPrice) {
            throw new Error("Failed to retrieve klarna price");
        }

        const rawValue = user.shares * klarnaPrice;
        const totalShareValue = Number.isInteger(rawValue) ? rawValue : Number(rawValue.toFixed(2));
    
        return {
          ...user,
          totalShareValue
        };
    } catch (err) {
        throw err;
    }
};