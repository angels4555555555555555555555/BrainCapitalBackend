import Admin from "../models/Admin.js";
import User from "../models/User.js";

export const adminAuthorization = async (req, res, next) => {
    try {
      const { id } = req.authentication;
      const admin = await Admin.findById(id);
      if (!admin) 
      {
        // You are not authorized to perform this action.
        return res.status(403).json({ message: "Sie sind nicht berechtigt, diese Aktion durchzuführen." });
      }

      req.user = admin;
      next();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
};
export const userAuthorization = async (req, res, next) => {
    try {
        const { id } = req.authentication;
        const user = await User.findById(id);
        if (!user) 
        {
          // You are not authorized to perform this action.
          return res.status(403).json({ message: "Sie sind nicht berechtigt, diese Aktion durchzuführen." });
        }
  
        req.user = user;
        next();
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
};