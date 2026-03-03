"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAsset = exports.uploadPreviewImage = exports.uploadPdf = void 0;
const cloudinary_1 = require("cloudinary");
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    // eslint-disable-next-line no-console
    console.warn('Cloudinary environment variables are not fully configured');
}
cloudinary_1.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});
const uploadPdf = async (filePath) => {
    return cloudinary_1.v2.uploader.upload(filePath, {
        resource_type: 'raw',
        folder: 'notes-marketplace/pdfs',
        format: 'pdf',
    });
};
exports.uploadPdf = uploadPdf;
const uploadPreviewImage = async (filePath) => {
    return cloudinary_1.v2.uploader.upload(filePath, {
        resource_type: 'image',
        folder: 'notes-marketplace/previews',
    });
};
exports.uploadPreviewImage = uploadPreviewImage;
const deleteAsset = async (publicId, resourceType) => {
    return cloudinary_1.v2.uploader.destroy(publicId, { resource_type: resourceType });
};
exports.deleteAsset = deleteAsset;
