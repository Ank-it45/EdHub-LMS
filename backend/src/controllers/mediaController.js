const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { successResponse, errorResponse } = require('../utils/response');

// Memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are supported (JPEG, PNG, WebP, GIF).'), false);
    }
  },
});

const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No image file uploaded.', 400);
    }

    const { folder = 'edhub' } = req.body;

    // Check if real Cloudinary credentials are provided or if in demo fallback
    const isRealCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== '123456789012345';

    if (isRealCloudinary) {
      // Stream buffer to Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `edhub/${folder}`,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      const result = await uploadPromise;
      return successResponse(
        res,
        {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
        'Media uploaded to Cloudinary successfully'
      );
    } else {
      // Demo / Local development base64 data URI fallback
      const base64Data = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64Data}`;

      return successResponse(
        res,
        {
          url: dataUri,
          publicId: `edhub_local_${Date.now()}`,
          format: req.file.mimetype.split('/')[1],
        },
        'Media processed successfully (Local / Demo storage)'
      );
    }
  } catch (error) {
    console.error('Media upload error:', error);
    return errorResponse(res, error.message || 'Media upload failed.', 500);
  }
};

module.exports = {
  upload,
  uploadMedia,
};
