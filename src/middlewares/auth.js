import jwt from "jsonwebtoken";

export const authenticateUserToken = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        // No token provided
        return res.status(401).json({ message: 'Kein Token bereitgestellt' });
    }

    try {
        const decryptedToken = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decryptedToken) {
            //Invalid token
            return res.status(403).json({ message: 'Ungültiger Token' });
        }

        req.authentication = decryptedToken;

        next();
    } catch (err) {
        console.log(err);
        //Invalid token
        return res.status(403).json({ message: 'Ungültiger Token' });
    }
};

export const authenticateAdminToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        // No token provided
        return res.status(401).json({ message: 'Kein Token bereitgestellt' });
    }

    try {
        const decryptedToken = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decryptedToken) {
            console.log(decryptedToken);
            // Invalid token
            return res.status(403).json({ message: 'Ungültiger Token' });
        }

        req.authentication = decryptedToken;

        next();
    } catch (err) {
        console.log(err);
        // Invalid token
        return res.status(403).json({ message: 'Ungültiger Token' });
    }
};