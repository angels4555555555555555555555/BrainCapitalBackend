import Admin from "../models/Admin.js";
import User from "../models/User.js";
import { hashPassword, verifyPassword } from "../utils/hashPassword.js";
import {
  encryptPassword,
  decryptPassword,
} from "../utils/symmetricEncryption.js";
import { generateAuthToken } from "../utils/jwt.js";
import { uploadSingleImage, deleteSingleImage } from "../utils/imageUpload.js";

export const signup = async (email, password) => {
  try {
    //Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      // An admin with same email already exists.
      throw new Error(
        "Ein Administrator mit derselben E-Mail-Adresse existiert bereits."
      );
    }

    const hash = await hashPassword(password);
    await Admin.create({ email, password: hash });
  } catch (err) {
    throw err;
  }
};

export const login = async (email, password) => {
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Invalid admin email or password
      throw new Error(
        "Ungültige Administrator-E-Mail oder ungültiges Passwort"
      );
    }
    const isPasswordValid = await verifyPassword(password, admin.password);
    if (!isPasswordValid) {
      // Invalid admin email or password
      throw new Error(
        "Ungültige Administrator-E-Mail oder ungültiges Passwort"
      );
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
      // Invalid admin id
      throw new Error("Ungültige Administrator-ID");
    }
    const isPasswordValid = await verifyPassword(oldPassword, admin.password);
    if (!isPasswordValid) {
      // Invalid current password
      throw new Error("Ungültiges aktuelles Passwort");
    }
    const hash = await hashPassword(newPassword);
    admin.password = hash;
    await admin.save();
  } catch (err) {
    throw err;
  }
};

export const getUsers = async (page = 1, pageSize = 10) => {
  try {
    const skip = (parseInt(page) - 1) * pageSize;

    const [users, totalUsers] = await Promise.all([
      User.find()
        .skip(skip)
        .limit(pageSize)
        .select("-password -encryptedPassword -profilePicture")
        .lean(),
      User.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalUsers / pageSize);

    return {
      users,
      totalUsers,
      currentPage: parseInt(page),
      totalPages,
    };
  } catch (err) {
    throw err;
  }
};

export const searchUsers = async (searchTerm, page = 1, pageSize = 10) => {
  try {
    const skip = (parseInt(page) - 1) * pageSize;
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = {
      $or: [
        { firstName: { $regex: escapedSearchTerm, $options: "i" } },
        { lastName: { $regex: escapedSearchTerm, $options: "i" } },
        { email: { $regex: escapedSearchTerm, $options: "i" } },
      ],
    };

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .skip(skip)
        .limit(pageSize)
        .select("-password -encryptedPassword -profilePicture")
        .lean(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalUsers / pageSize);

    return {
      users,
      totalUsers,
      currentPage: parseInt(page),
      totalPages,
    };
  } catch (err) {
    throw err;
  }
};

export const createUser = async ({
  email,
  password,
  firstName,
  lastName,
  dob,
  gender,
  country,
  products,
  festgeld = {},
  tagesgeld = {},
  openAI = {},
}) => {
  try {
    //Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // A user with same email already exists.
      throw new Error(
        "Ein Benutzer mit derselben E-Mail-Adresse existiert bereits."
      );
    }

    const encryptedPassword = encryptPassword(password);
    const hash = await hashPassword(password);

    await User.create({
      email,
      password: hash,
      encryptedPassword: encryptedPassword,
      firstName,
      lastName,
      dob,
      gender,
      country,
      products,
      festgeld: {
        bank: festgeld.bank || "",
        betrag: festgeld.betrag !== undefined && festgeld.betrag !== "" ? festgeld.betrag : 0,
        zinsen: festgeld.zinsen !== undefined && festgeld.zinsen !== "" ? festgeld.zinsen : 0,
        laufzeit: festgeld.laufzeit || "",
      },
      tagesgeld: {
        bank: tagesgeld.bank || "",
        betrag: tagesgeld.betrag !== undefined && tagesgeld.betrag !== "" ? tagesgeld.betrag : 0,
        zinsen: tagesgeld.zinsen !== undefined && tagesgeld.zinsen !== "" ? tagesgeld.zinsen : 0,
        garantierteZinslaufzeit: tagesgeld.garantierteZinslaufzeit || "",
      },
      openAI: {
        anzahl: openAI.anzahl !== undefined && openAI.anzahl !== "" ? openAI.anzahl : 0,
        gekaufterWert: openAI.gekaufterWert !== undefined && openAI.gekaufterWert !== "" ? openAI.gekaufterWert : 0,
        aktuellerWert: openAI.aktuellerWert !== undefined && openAI.aktuellerWert !== "" ? openAI.aktuellerWert : 0,
        investition: openAI.investition !== undefined && openAI.investition !== "" ? openAI.investition : 0,
        aktuellerGewinn: openAI.aktuellerGewinn !== undefined && openAI.aktuellerGewinn !== "" ? openAI.aktuellerGewinn : 0,
        depotWert: openAI.depotWert !== undefined && openAI.depotWert !== "" ? openAI.depotWert : 0,
      },
    });
  } catch (err) {
    throw err;
  }
};

const PRODUCT_FIELDS = {
  festgeld: ["bank", "betrag", "zinsen", "laufzeit"],
  tagesgeld: ["bank", "betrag", "zinsen", "garantierteZinslaufzeit"],
  openAI: ["anzahl", "gekaufterWert", "aktuellerWert", "investition", "aktuellerGewinn", "depotWert"],
};

export const updateUser = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      // User not found
      throw new Error("Benutzer nicht gefunden");
    }

    const topLevelFields = ["firstName", "lastName", "dob", "gender", "country", "products"];
    for (const key of topLevelFields) {
      if (key in updateData) {
        user[key] = updateData[key];
      }
    }

    // Merge nested product updates field-by-field so partial updates don't wipe sibling fields
    for (const [group, fields] of Object.entries(PRODUCT_FIELDS)) {
      if (updateData[group]) {
        if (!user[group]) user[group] = {};
        for (const field of fields) {
          if (field in updateData[group]) {
            user[group][field] = updateData[group][field];
          }
        }
      }
    }

    await user.save();
    return user;
  } catch (err) {
    throw err;
  }
};

export const deleteUser = async (userIds) => {
  try {
    await User.deleteMany({ _id: { $in: userIds } });
  } catch (err) {
    throw err;
  }
};

export const revealPassword = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      // User not found
      throw new Error("Benutzer nicht gefunden");
    }
    const decryptedPassword = decryptPassword(user.encryptedPassword);
    return decryptedPassword;
  } catch (err) {
    throw err;
  }
};

export const updateProfilePicture = async (admin, filePath) => {
  try {
    if (
      admin.profilePicture &&
      admin.profilePicture.publicId &&
      admin.profilePicture.publicId !== ""
    ) {
      await deleteSingleImage(admin.profilePicture.publicId);
    }

    const result = await uploadSingleImage(filePath);

    await Admin.findByIdAndUpdate(admin._id, {
      profilePicture: { url: result.url, publicId: result.publicId },
    });
  } catch (err) {
    throw err;
  }
};

export const getProfileData = async (userId) => {
  try {
    const admin = await Admin.findById(userId).select("-password").lean();
    if (!admin) {
      // Admin not found
      throw new Error("Administrator nicht gefunden");
    }
    return admin;
  } catch (err) {
    throw err;
  }
};

export const getUser = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select("-password -encryptedPassword")
      .lean();
    if (!user) {
      // User not found
      throw new Error("Benutzer nicht gefunden");
    }
    return user;
  } catch (err) {
    throw err;
  }
};
