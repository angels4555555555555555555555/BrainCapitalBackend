import fs from "fs";
import { login, updateProfilePicture, getProfileData } from "../services/user.service.js";
// Controller to update user password
import { updateUserPassword } from "../services/user.service.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);

    res.cookie("accessToken", token, {
      ...cookieOptions(),
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    // Login successful
    return res.status(200).json({ message: "Anmeldung erfolgreich" });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("accessToken", cookieOptions());

    // Logout successful
    return res.status(200).json({ message: "Abmeldung erfolgreich" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

export const updateUserProfilePicture = async (req, res) => {
  try
  {
    if (!req.file) 
    {
      // No Picture uploaded
      return res.status(400).json({ message: "Kein Bild hochgeladen" });
    }
    await updateProfilePicture(req.user, req.file.path);

    // Profile picture updated successfully
    return res.status(200).json({ message: "Profilbild erfolgreich aktualisiert" });
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

export const getUserProfileData = async (req, res) => {
  try {
    const user = await getProfileData(req.user._id);
    // Profile data fetched successfully
    return res.status(200).json({ message: "Profildaten erfolgreich abgerufen", user: user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

export const userCheckAuthStatus = async (req, res) => {
  try {

    // Authenticated
    return res.status(200).json({ message: "Authentifiziert" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}


export const updatePassword = async (req, res) => {
  try {
    const userId = req.user?._id || req.user;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Aktuelles und neues Passwort erforderlich" });
    }
    await updateUserPassword(userId, currentPassword, newPassword);
    return res.status(200).json({ message: "Passwort erfolgreich aktualisiert" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
