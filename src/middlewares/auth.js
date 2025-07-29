import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decryptedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decryptedToken) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.authentication = decryptedToken;

        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};