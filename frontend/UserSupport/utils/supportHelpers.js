const { ATTACHMENT_LIMITS } = require('./supportConstants');

function getFileName(file = {}) {
  return file.originalname || file.filename || file.name || 'attachment';
}

function getMimeType(file = {}) {
  return file.mimetype || file.type || '';
}

function getSizeBytes(file = {}) {
  if (typeof file.size === 'number') return file.size;
  if (typeof file.sizeBytes === 'number') return file.sizeBytes;
  return 0;
}

function getFileType(mimeType = '') {
  if (ATTACHMENT_LIMITS.allowedImages.includes(mimeType)) return 'image';
  if (ATTACHMENT_LIMITS.allowedVideos.includes(mimeType)) return 'video';
  return null;
}

function validateAttachments(files = []) {
  const list = Array.isArray(files) ? files : [];
  const errors = [];

  if (list.length > ATTACHMENT_LIMITS.maxFiles) {
    errors.push({ filename: 'attachments', message: `Maximum ${ATTACHMENT_LIMITS.maxFiles} files allowed.` });
  }

  list.forEach((file) => {
    const filename = getFileName(file);
    const mimeType = getMimeType(file);
    const fileType = getFileType(mimeType) || (file.type === 'image' || file.type === 'video' ? file.type : null);
    const sizeBytes = getSizeBytes(file);

    if (!fileType) {
      errors.push({
        filename,
        message: 'Unsupported file type. Use JPG, PNG, WEBP, MP4 or MOV.',
      });
      return;
    }

    const maxBytes = fileType === 'image'
      ? ATTACHMENT_LIMITS.maxImageSizeMB * 1024 * 1024
      : ATTACHMENT_LIMITS.maxVideoSizeMB * 1024 * 1024;

    if (sizeBytes > maxBytes) {
      errors.push({
        filename,
        message: `${fileType === 'image' ? 'Image' : 'Video'} exceeds ${fileType === 'image' ? ATTACHMENT_LIMITS.maxImageSizeMB : ATTACHMENT_LIMITS.maxVideoSizeMB}MB limit.`,
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

function formatFileSize(bytes = 0) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

module.exports = {
  validateAttachments,
  formatFileSize,
  getFileType,
};
