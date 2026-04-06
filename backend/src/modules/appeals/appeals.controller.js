const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../../../utils/cloudinary');
const {
  createAppealSchema,
  adminDecisionSchema,
  createAppeal,
  getMyAppeal,
  getAdminAppeals,
  getAdminAppealById,
  decideAppeal
} = require('./appeals.service');

const appealUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: 20 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Unsupported attachment type. Use image, video, PDF or DOC.'));
    }
    return cb(null, true);
  }
});

const uploadToCloudinary = async (file) => {
  const resourceType = file.mimetype.startsWith('image/')
    ? 'image'
    : file.mimetype.startsWith('video/')
      ? 'video'
      : 'raw';

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'logoipsum_appeals',
        resource_type: resourceType
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const uploadAppealAttachmentsMiddleware = (req, res, next) => {
  appealUpload.array('attachments', 5)(req, res, (error) => {
    if (!error) return next();
    return res.status(400).json({ success: false, message: error.message || 'Attachment upload failed' });
  });
};

const getAuthUserId = (req) => req.user?.userId || req.user?._id;

const handleError = (res, error) => {
  if (error?.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.issues
    });
  }

  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Something went wrong'
  });
};

const createAppealHandler = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const payload = createAppealSchema.parse(req.body);
    const files = Array.isArray(req.files) ? req.files : [];

    const attachments = [];
    for (const file of files) {
      const uploaded = await uploadToCloudinary(file);
      attachments.push({
        url: uploaded.secure_url,
        type: file.mimetype.startsWith('image/')
          ? 'image'
          : file.mimetype.startsWith('video/')
            ? 'video'
            : 'file',
        filename: file.originalname,
        sizeBytes: file.size
      });
    }

    const appeal = await createAppeal({ userId, payload: { ...payload, attachments } });

    return res.status(201).json({
      success: true,
      appeal
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getMyAppealHandler = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const data = await getMyAppeal({ userId });
    return res.json(data);
  } catch (error) {
    return handleError(res, error);
  }
};

const getAdminAppealsHandler = async (req, res) => {
  try {
    const result = await getAdminAppeals({ query: req.query });
    return res.json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error);
  }
};

const getAdminAppealByIdHandler = async (req, res) => {
  try {
    const appeal = await getAdminAppealById(req.params.id);
    return res.json({ success: true, appeal });
  } catch (error) {
    return handleError(res, error);
  }
};

const decideAppealHandler = async (req, res) => {
  try {
    const adminUserId = getAuthUserId(req);
    if (!adminUserId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const payload = adminDecisionSchema.parse(req.body);
    const result = await decideAppeal({
      appealId: req.params.id,
      adminUserId,
      payload
    });

    return res.json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  uploadAppealAttachmentsMiddleware,
  createAppealHandler,
  getMyAppealHandler,
  getAdminAppealsHandler,
  getAdminAppealByIdHandler,
  decideAppealHandler
};
