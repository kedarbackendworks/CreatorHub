const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../../../backend/utils/cloudinary');
const { createTicket } = require('../services/submitTicket.service');
const { getMyTickets, getMyTicketById } = require('../services/userTickets.service');
const { ATTACHMENT_LIMITS } = require('../utils/supportConstants');
const { validateAttachments, getFileType } = require('../utils/supportHelpers');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: ATTACHMENT_LIMITS.maxFiles,
    fileSize: ATTACHMENT_LIMITS.maxVideoSizeMB * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      ...ATTACHMENT_LIMITS.allowedImages,
      ...ATTACHMENT_LIMITS.allowedVideos,
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Unsupported file type. Use JPG, PNG, WEBP, MP4 or MOV.'));
    }
    return cb(null, true);
  },
});

function uploadAttachmentsMiddleware(req, res, next) {
  upload.array('attachments', ATTACHMENT_LIMITS.maxFiles)(req, res, (err) => {
    if (!err) return next();

    const message = err.message || 'File upload failed.';
    return res.status(400).json({ message });
  });
}

async function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'logoipsum_support_tickets',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}

async function createUserTicket(req, res) {
  const files = Array.isArray(req.files) ? req.files : [];
  const validated = validateAttachments(files);

  if (!validated.valid) {
    return res.status(400).json({
      message: 'Invalid attachments.',
      fileErrors: validated.errors,
    });
  }

  const uploaded = [];

  try {
    for (const file of files) {
      const result = await uploadToCloudinary(file);
      uploaded.push({
        url: result.secure_url,
        type: getFileType(file.mimetype),
        filename: file.originalname,
        sizeBytes: file.size,
      });
    }

    const ticket = await createTicket({
      submittedBy: req.user._id,
      submitterRole: req.user.role,
      tag: req.body.tag,
      heading: req.body.heading,
      description: req.body.description,
      attachments: uploaded,
    });

    return res.status(201).json({ ticket });
  } catch (error) {
    if (uploaded.length) {
      console.error('[user-support] orphaned uploads for cleanup:', uploaded.map((f) => f.url));
    }

    return res.status(error.statusCode || 500).json({
      message: error.message || 'Unable to create ticket.',
      fileErrors: error.fileErrors || [],
    });
  }
}

async function listMyTickets(req, res) {
  try {
    const data = await getMyTickets(req.user._id, {
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status,
    });

    return res.status(200).json(data);
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to fetch your tickets.' });
  }
}

async function getMyTicket(req, res) {
  try {
    const ticket = await getMyTicketById(req.params.ticketId, req.user._id);
    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Unable to fetch ticket.' });
  }
}

module.exports = {
  uploadAttachmentsMiddleware,
  createUserTicket,
  listMyTickets,
  getMyTicket,
};
