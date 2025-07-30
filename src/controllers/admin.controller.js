import fs from "fs";
import { login, changePassword, searchUsers, getUsers, createUser, updateUser, deleteUser, revealPassword, updateProfilePicture, updateKlarnaPrice } from "../services/admin.service.js";
import { getKlarnaPrice } from "../utils/klarnaPrice.js";

export const adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    await signup(email, password);
    return res.status(201).json({ message: "Signup successful" });
  } catch (err) {
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
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login successful" });

  } catch (err) {
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
    return res.status(400).json({ message: err.message });
  }
}

export const adminChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await changePassword(email, currentPassword, newPassword);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const adminGetUsers = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const {users, totalUsers, currentPage, totalPages} = await getUsers(page, pageSize);
    return res.status(200).json({ message: "Users fetched successfully", users, totalUsers, currentPage, totalPages });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const adminSearchUsers = async (req, res) => {
  try {
    const { searchTerm, page, pageSize } = req.query;
    const {users, totalUsers, currentPage, totalPages} = await searchUsers(searchTerm, page, pageSize);
    return res.status(200).json({ message: "Users fetched successfully", users, totalUsers, currentPage, totalPages });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const adminCreateUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, dob, gender, country, shares } = req.body;
    await createUser({ email, password, firstName, lastName, dob, gender, country, shares });
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const adminUpdateUser = async (req, res) => {
  try {
    const { userId, ...fieldsToUpdate } = req.body;
    await updateUser(userId, fieldsToUpdate);
    return res.status(201).json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteUser(id);
    return res.status(201).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const revealUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const password = await revealPassword(id);
    return res.status(200).json({ message: "Password revealed successfully", password });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateAdminProfilePicture = async (req, res) => {
  try
  {
    if (!req.file) 
    {
      return res.status(400).json({ message: "No file uploaded" });
    }
    await updateProfilePicture(req.user, req.file.path);
    return res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (err) {
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
    return res.status(400).json({ message: err.message });
  }
}

export const changeKlarnaPrice = async (req, res) => {
  try {
    const { newklarnaPrice } = req.body;
    await updateKlarnaPrice(newklarnaPrice);
    return res.status(200).json({ message: "Klarna price updated successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}