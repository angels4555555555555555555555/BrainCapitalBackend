import fs from "fs";
import {
  signup,
  login,
  getProfileData,
  changePassword,
  searchUsers,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  revealPassword,
  updateProfilePicture,
  updateKlarnaPrice,
} from "../services/admin.service.js";
import { getKlarnaPrice } from "../utils/klarnaPrice.js";

export const adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    await signup(email, password);

    // Signup successful
    return res.status(201).json({ message: "Registrierung erfolgreich" });
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

    // Login successful
    return res.status(200).json({ message: "Anmeldung erfolgreich" });
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

    // Logout successful
    return res.status(200).json({ message: "Abmeldung erfolgreich" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await changePassword(req.user._id, currentPassword, newPassword);

    // Password changed successfully
    return res.status(200).json({ message: "Passwort erfolgreich geändert" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminGetUsers = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const { users, totalUsers, currentPage, totalPages } = await getUsers(
      page,
      pageSize
    );

    // Users fetched successfully
    return res.status(200).json({
      message: "Benutzer erfolgreich abgerufen",
      users,
      totalUsers,
      currentPage,
      totalPages,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminGetUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUser(id);

    // User fetched successfully"
    return res
      .status(200)
      .json({ message: "Benutzer erfolgreich abgerufen", user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminSearchUsers = async (req, res) => {
  try {
    const { searchTerm, page, pageSize } = req.query;
    const { users, totalUsers, currentPage, totalPages } = await searchUsers(
      searchTerm,
      page,
      pageSize
    );

    // Users fetched successfully
    return res.status(200).json({
      message: "Benutzer erfolgreich abgerufen",
      users,
      totalUsers,
      currentPage,
      totalPages,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminCreateUser = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      dob,
      gender,
      country,
      shares,
      klarnaPurchasePrice,
      klarnaPrice,
      bank,
      laufzeit,
      betrag,
      zinsatz,
    } = req.body;

    await createUser({
      email,
      password,
      firstName,
      lastName,
      dob,
      gender,
      country,
      shares,
      klarnaPurchasePrice,
      klarnaPrice,
      bank,
      laufzeit,
      betrag,
      zinsatz,
    });

    // User created successfully
    return res.status(201).json({ message: "Benutzer erfolgreich erstellt" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminUpdateUser = async (req, res) => {
  try {
    const { userId, ...fieldsToUpdate } = req.body;
    await updateUser(userId, fieldsToUpdate);

    // User updated successfully"
    return res
      .status(201)
      .json({ message: "Benutzer erfolgreich aktualisiert" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const { userIds } = req.body;
    await deleteUser(userIds);

    // User deleted successfully
    return res.status(201).json({ message: "Benutzer erfolgreich gelöscht" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const revealUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const password = await revealPassword(id);

    // Password revealed successfully
    return res
      .status(200)
      .json({ message: "Passwort erfolgreich angezeigt", password });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const updateAdminProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      // No Picture uploaded
      return res.status(400).json({ message: "Kein Bild hochgeladen" });
    }
    await updateProfilePicture(req.user, req.file.path);

    // Profile picture updated successfully
    return res
      .status(200)
      .json({ message: "Profilbild erfolgreich aktualisiert" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  } finally {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

export const retrieveKlarnaPrice = async (req, res) => {
  try {
    const klarnaPrice = await getKlarnaPrice();

    // Klarna price fetched successfully
    return res
      .status(200)
      .json({ message: "SpaceX-Preis erfolgreich abgerufen", klarnaPrice });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const changeKlarnaPrice = async (req, res) => {
  try {
    const { newKlarnaPrice } = req.body;
    await updateKlarnaPrice(newKlarnaPrice);

    // Klarna price updated successfully
    return res
      .status(200)
      .json({ message: "SpaceX-Preis erfolgreich aktualisiert" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const adminCheckAuthStatus = async (req, res) => {
  try {
    // Authenticated
    return res.status(200).json({ message: "Authentifiziert" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

export const getAdminProfileData = async (req, res) => {
  try {
    const profile = await getProfileData(req.user._id);

    // Profile data fetched successfully
    return res
      .status(200)
      .json({ message: "Profildaten erfolgreich abgerufen", admin: profile });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};
