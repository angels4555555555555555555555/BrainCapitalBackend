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
        // Cloudinary upload failed:
        throw new Error('Cloudinary-Upload fehlgeschlagen: ' + error.message);
    }
};

export const deleteSingleImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;

    } catch (error) {
        // Cloudinary deletion failed:
        throw new Error('Cloudinary-Löschung fehlgeschlagen: ' + error.message);
    }
};