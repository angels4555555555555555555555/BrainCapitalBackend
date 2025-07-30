import fs from "fs";
import { login, updateProfilePicture, getProfileData } from "../services/user.service.js";

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);

    res.cookie("accessToken", token, {
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

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
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

export const updateUserProfilePicture = async (req, res) => {
  try
  {
    if (!req.file) 
    {
      return res.status(400).json({ message: "No file uploaded" });
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

export const getUserProfileData = async (req, res) => {
  try {
    const user = await getProfileData(req.user._id);
    return res.status(200).json({ message: "Profile data fetched successfully", user: user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}