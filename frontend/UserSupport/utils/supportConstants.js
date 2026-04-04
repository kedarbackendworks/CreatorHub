const TICKET_TAGS = ['finance', 'support', 'moderation', 'other'];

const TAG_TO_ISSUE_TYPE = {
  finance: 'fraud',
  support: 'other',
  moderation: 'harassment',
  other: 'other',
};

const TAG_PRIORITY = {
  finance: 'high',
  moderation: 'medium',
  support: 'medium',
  other: 'low',
};

const TAG_DESCRIPTIONS = {
  finance: 'Payment issues, wallet, refunds',
  support: 'Account, access, general help',
  moderation: 'Content disputes, bans, reports',
  other: 'Anything else',
};

const ATTACHMENT_LIMITS = {
  maxFiles: 5,
  maxImageSizeMB: 10,
  maxVideoSizeMB: 50,
  allowedImages: ['image/jpeg', 'image/png', 'image/webp'],
  allowedVideos: ['video/mp4', 'video/quicktime'],
};

module.exports = {
  TICKET_TAGS,
  TAG_TO_ISSUE_TYPE,
  TAG_PRIORITY,
  TAG_DESCRIPTIONS,
  ATTACHMENT_LIMITS,
};
