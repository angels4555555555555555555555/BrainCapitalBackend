import { signup, login } from "../services/admin.service.js";
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