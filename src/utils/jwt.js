import jwt from 'jsonwebtoken';

export const generateAuthToken = (id, email, isAdmin) => {
    const token = jwt.sign({ id, email, isAdmin }, process.env.JWT_SECRET, { expiresIn: "3d" }); 
    return token;
};