import { v2 as cloudinary } from 'cloudinary';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  // eslint-disable-next-line no-console
  console.warn('Cloudinary environment variables are not fully configured');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadPdf = async (filePath: string) => {
  return cloudinary.uploader.upload(filePath, {
    resource_type: 'raw',
    folder: 'notes-marketplace/pdfs',
    format: 'pdf',
  });
};

export const uploadPreviewImage = async (filePath: string) => {
  return cloudinary.uploader.upload(filePath, {
    resource_type: 'image',
    folder: 'notes-marketplace/previews',
  });
};

export const deleteAsset = async (publicId: string, resourceType: 'raw' | 'image') => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

