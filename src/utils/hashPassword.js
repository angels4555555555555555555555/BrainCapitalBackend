import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    const saltRounds = 12; 
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

export const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};