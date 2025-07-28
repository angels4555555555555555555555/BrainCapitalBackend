export const signup = async (req, res) => {
    try {
      return res.status(201).json({ message: "Signup successful" });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
};