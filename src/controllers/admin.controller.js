import fs from "fs";
import { signup, login, getProfileData, changePassword, searchUsers, getUsers, getUser, createUser, updateUser, deleteUser, revealPassword, updateProfilePicture, updateKlarnaPrice } from "../services/admin.service.js";
import { getKlarnaPrice } from "../utils/klarnaPrice.js";

export const adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    await signup(email, password);
    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "Login successful" });

  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

export const adminChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await changePassword(req.user._id, currentPassword, newPassword);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminGetUsers = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const {users, totalUsers, currentPage, totalPages} = await getUsers(page, pageSize);
    return res.status(200).json({ message: "Users fetched successfully", users, totalUsers, currentPage, totalPages });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminGetUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUser(id);
    return res.status(200).json({ message: "User fetched successfully", user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

export const adminSearchUsers = async (req, res) => {
  try {
    const { searchTerm, page, pageSize } = req.query;
    const {users, totalUsers, currentPage, totalPages} = await searchUsers(searchTerm, page, pageSize);
    return res.status(200).json({ message: "Users fetched successfully", users, totalUsers, currentPage, totalPages });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminCreateUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, dob, gender, country, shares } = req.body;
    await createUser({ email, password, firstName, lastName, dob, gender, country, shares });
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminUpdateUser = async (req, res) => {
  try {
    const { userId, ...fieldsToUpdate } = req.body;
    await updateUser(userId, fieldsToUpdate);
    return res.status(201).json({ message: "User updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const { userIds } = req.body;
    await deleteUser(userIds);
    return res.status(201).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const revealUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const password = await revealPassword(id);
    return res.status(200).json({ message: "Password revealed successfully", password });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const updateAdminProfilePicture = async (req, res) => {
  try
  {
    if (!req.file) 
    {
      return res.status(400).json({ message: "No Picture uploaded" });
    }
    await updateProfilePicture(req.user, req.file.path);
    return res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
  finally
  {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) 
    {
      fs.unlinkSync(req.file.path);
    }
  }
}

export const retrieveKlarnaPrice = async (req, res) => {
  try {
    const klarnaPrice = await getKlarnaPrice();
    return res.status(200).json({ message: "Klarna price fetched successfully", klarnaPrice });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

export const changeKlarnaPrice = async (req, res) => {
  try {
    const { newKlarnaPrice } = req.body;
    await updateKlarnaPrice(newKlarnaPrice);
    return res.status(200).json({ message: "Klarna price updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

export const adminCheckAuthStatus = async (req, res) => {
  try {
    return res.status(200).json({ message: "Authenticated" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

export const getAdminProfileData = async (req, res) => {
  try {
    const profile = await getProfileData(req.user._id);
    return res.status(200).json({ message: "Profile data fetched successfully", admin: profile });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}