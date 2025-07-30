import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadSingleImage = async (filePath, folder = 'uploads') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: 'image',
        });

        fs.unlinkSync(filePath);

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };

    } catch (error) {
        throw new Error('Cloudinary upload failed: ' + error.message);
    }
};

export const deleteSingleImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;

    } catch (error) {
        throw new Error('Cloudinary deletion failed: ' + error.message);
    }
};