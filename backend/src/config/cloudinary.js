import { v2 as cloudinary } from 'cloudinary';
import { logger } from './logger.js';
import fs from 'fs';
import path from 'path';

const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  logger.info('Cloudinary configured successfully.');
} else {
  logger.info('Cloudinary credentials missing. File uploads will fallback to local storage mode.');
}

export const uploadToCloudinary = async (filePath, folder = 'smart_rental') => {
  try {
    if (isCloudinaryConfigured()) {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto',
      });
      // Clean local temp file after upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } else {
      // Fallback local file URL
      const fileName = path.basename(filePath);
      const relativePath = `/uploads/${fileName}`;
      return {
        url: relativePath,
        publicId: fileName,
      };
    }
  } catch (error) {
    logger.error(`Cloudinary Upload Error: ${error.message}`);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (isCloudinaryConfigured() && publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
    return true;
  } catch (error) {
    logger.error(`Cloudinary Delete Error: ${error.message}`);
    return false;
  }
};
