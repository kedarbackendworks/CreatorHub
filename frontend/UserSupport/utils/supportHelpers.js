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
  if (ATTACHMENT_LIMITS.allowedFiles.includes(mimeType)) return 'file';
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
    const fileType = getFileType(mimeType) || (['image', 'video', 'file'].includes(file.type) ? file.type : null);
    const sizeBytes = getSizeBytes(file);

    if (!fileType) {
      errors.push({
        filename,
        message: 'Unsupported file type. Use JPG, PNG, WEBP, MP4, MOV, PDF or DOC.',
      });
      return;
    }

    const maxBytes = fileType === 'image'
      ? ATTACHMENT_LIMITS.maxImageSizeMB * 1024 * 1024
      : fileType === 'video'
        ? ATTACHMENT_LIMITS.maxVideoSizeMB * 1024 * 1024
        : ATTACHMENT_LIMITS.maxFileSizeMB * 1024 * 1024;

    if (sizeBytes > maxBytes) {
      errors.push({
        filename,
        message: `${fileType === 'image' ? 'Image' : fileType === 'video' ? 'Video' : 'File'} exceeds ${fileType === 'image' ? ATTACHMENT_LIMITS.maxImageSizeMB : fileType === 'video' ? ATTACHMENT_LIMITS.maxVideoSizeMB : ATTACHMENT_LIMITS.maxFileSizeMB}MB limit.`,
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
