import Admin from "../models/Admin.js";
import User from "../models/User.js";
import KlarnaPrice from "../models/KlarnaPrice.js";
import { hashPassword, verifyPassword } from "../utils/hashPassword.js";
import { encryptPassword, decryptPassword } from "../utils/symmetricEncryption.js";
import { generateAuthToken } from "../utils/jwt.js";
import { uploadSingleImage, deleteSingleImage } from "../utils/imageUpload.js";
import { getKlarnaPrice } from "../utils/klarnaPrice.js";

export const signup = async (email, password) => {
    try {

        //Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            throw new Error("An admin with same email already exists.");
        }
        
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

export const changePassword = async (id, oldPassword, newPassword) => {
    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            throw new Error("Invalid admin id");
        }
        const isPasswordValid = await verifyPassword(oldPassword, admin.password);
        if (!isPasswordValid) {
            throw new Error("Invalid current password");
        }
        const hash = await hashPassword(newPassword);
        admin.password = hash;
        await admin.save();
    } catch (err) {
        throw err;
    }
}

export const getUsers = async (page = 1, pageSize = 10) => {
    try {
        const skip = (parseInt(page) - 1) * pageSize;
        const klarnaPrice = await getKlarnaPrice();

        if (!klarnaPrice) {
            throw new Error("Failed to retrieve klarna price");
        }

        const [users, totalUsers] = await Promise.all([
            User.find()
                .skip(skip)
                .limit(pageSize)
                .select("-password -profilePicture")
                .lean(),
            User.countDocuments()
        ]);

        const totalPages = Math.ceil(totalUsers / pageSize);

        const modifiedUsers = users.map(user => {
            const rawValue = user.shares * klarnaPrice;
            const totalShareValue =
              Number.isInteger(rawValue) ? rawValue : Number(rawValue.toFixed(2));
          
            return {
              ...user,
              totalShareValue
            };
        });

        return {
            users: modifiedUsers,
            totalUsers,
            currentPage: parseInt(page),
            totalPages
        };
    } catch (err) {
        throw err;
    }
};

export const searchUsers = async (searchTerm, page = 1, pageSize = 10) => {
    try {
        const skip = (parseInt(page) - 1) * pageSize;
        const klarnaPrice = await getKlarnaPrice();

        if (!klarnaPrice) {
            throw new Error("Failed to retrieve klarna price");
        }

        const query = {
            $or: [
                { firstName: { $regex: searchTerm, $options: "i" } },
                { lastName: { $regex: searchTerm, $options: "i" } }
            ]
        };

        const [users, totalUsers] = await Promise.all([
            User.find(query)
                .skip(skip)
                .limit(pageSize)
                .select("-password -profilePicture")
                .lean(),
            User.countDocuments(query)
        ]);

        const modifiedUsers = users.map(user => {
            const rawValue = user.shares * klarnaPrice;
            const totalShareValue =
              Number.isInteger(rawValue) ? rawValue : Number(rawValue.toFixed(2));
          
            return {
              ...user,
              totalShareValue
            };
        });


        const totalPages = Math.ceil(totalUsers / pageSize);

        return {
            users: modifiedUsers,
            totalUsers,
            currentPage: parseInt(page),
            totalPages
        };
    } catch (err) {
        throw err;
    }
};

export const createUser = async ({ email, password, firstName, lastName, dob, gender, country, shares }) => {
    try {

        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("A user with same email already exists.");
        }

        const encryptedPassword = encryptPassword(password);
        const hash = await hashPassword(password);
        await User.create({ email, password: hash, encryptedPassword: encryptedPassword, firstName, lastName, dob, gender, country, shares });
    } catch (err) {
        throw err;
    }
};

export const updateUser = async (userId, updateData) => {

    try {
        const allowedFields = ['firstName', 'lastName', 'dob', 'gender', 'country', 'shares'];
        const updates = {};
      
        for (const key of allowedFields) {
          if (key in updateData) {
            updates[key] = updateData[key];
          }
        }
      
        const updatedUser = await User.findByIdAndUpdate(userId, updates, {
          new: true,
          runValidators: true
        });
      
        if (!updatedUser) {
          throw new Error('User not found');
        }
      
        return updatedUser;

    } catch (err) {
        throw err;
    }

};

export const deleteUser = async (userId) => {
    try {
        await User.findByIdAndDelete(userId);
    } catch (err) {
        throw err;
    }
};

export const revealPassword = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const decryptedPassword = decryptPassword(user.encryptedPassword);
        return decryptedPassword;
    } catch (err) {
        throw err;
    }
};

export const updateProfilePicture = async (admin, filePath) => {
    try
    {
        if(admin.profilePicture && admin.profilePicture.publicId && admin.profilePicture.publicId !== "")
        {
            await deleteSingleImage(admin.profilePicture.publicId);
        }

        const result = await uploadSingleImage(filePath);

        await Admin.findByIdAndUpdate(admin._id, { profilePicture: { url: result.url, publicId: result.publicId }});

    }
    catch(err)
    {
        throw err;
    }
};

export const updateKlarnaPrice = async (newklarnaPrice) => {
    try {
        await KlarnaPrice.updateOne(
            {},
            { $set: { currentPrice: newklarnaPrice } },
            { upsert: true }
        );
    } catch (err) {
        throw err;
    }
};