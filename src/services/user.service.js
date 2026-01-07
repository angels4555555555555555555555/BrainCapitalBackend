import User from "../models/User.js";
import { verifyPassword } from "../utils/hashPassword.js";
import { uploadSingleImage, deleteSingleImage } from "../utils/imageUpload.js";
import { generateAuthToken } from "../utils/jwt.js";
import { hashPassword } from "../utils/hashPassword.js";
import { encryptPassword } from "../utils/symmetricEncryption.js";

export const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Invalid user email or password
      throw new Error("Ungültige Benutzer-E-Mail oder ungültiges Passwort");
    }
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      // Invalid user email or password
      throw new Error("Ungültige Benutzer-E-Mail oder ungültiges Passwort");
    }
    const token = generateAuthToken(user._id, user.email, false);
    return token;
  } catch (err) {
    throw err;
  }
};

export const updateProfilePicture = async (user, filePath) => {
  try {
    if (
      user.profilePicture &&
      user.profilePicture.publicId &&
      user.profilePicture.publicId !== ""
    ) {
      await deleteSingleImage(user.profilePicture.publicId);
    }

    const result = await uploadSingleImage(filePath);

    await User.findByIdAndUpdate(user._id, {
      profilePicture: { url: result.url, publicId: result.publicId },
    });
  } catch (err) {
    throw err;
  }
};

export const getProfileData = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select("-password -encryptedPassword")
      .lean();
    if (!user) {
      // User not found
      throw new Error("Benutzer nicht gefunden");
    }

    // const klarnaPrice = await getKlarnaPrice();

    // if (!klarnaPrice) {
    //   // Failed to retrieve klarna price
    //   throw new Error("Fehler beim Abrufen des Klarna-Preises");
    // }

    // const rawValue = user.shares * klarnaPrice;
    // const totalShareValue = Number.isInteger(rawValue)
    //   ? rawValue
    //   : Number(rawValue.toFixed(2));

    // return {
    //   ...user,
    //   totalShareValue,
    //   klarnaPrice
    // };

    return user;
  } catch (err) {
    throw err;
  }
};



export const updateUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Benutzer nicht gefunden");
  }
  const isPasswordValid = await verifyPassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("Aktuelles Passwort ist falsch");
  }

  const encryptedPassword = encryptPassword(newPassword);
      const hash = await hashPassword(newPassword);

  user.password = hash;
  user.encryptedPassword = encryptedPassword;
  await user.save();
  return true;
};
