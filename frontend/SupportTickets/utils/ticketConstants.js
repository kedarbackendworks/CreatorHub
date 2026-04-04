const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'dismissed'];
const PRIORITY_LEVELS = ['low', 'medium', 'high'];
const ISSUE_TYPES = ['harassment', 'spam', 'fraud', 'explicit', 'impersonation', 'other'];

const PRIORITY_STYLES = {
  high: { bg: '#FEE2E2', text: '#DC2626' },
  medium: { bg: '#FEF3C7', text: '#D97706' },
  low: { bg: '#F3F4F6', text: '#6B7280' },
};

const STATUS_STYLES = {
  open: { bg: '#DBEAFE', text: '#2563EB' },
  in_progress: { bg: '#FEF3C7', text: '#D97706' },
  resolved: { bg: '#DCFCE7', text: '#16A34A' },
  dismissed: { bg: '#F3F4F6', text: '#6B7280' },
};

const REASON_TO_ISSUE_TYPE = {
  harassment: 'harassment',
  spam: 'spam',
  fraud: 'fraud',
  explicit: 'explicit',
  impersonation: 'impersonation',
  other: 'other',
};

const PRIORITY_WEIGHTS = {
  reporterCountThreshold: { medium: 3, high: 8 },
  highPriorityReasons: ['harassment', 'explicit', 'fraud'],
};

module.exports = {
  TICKET_STATUSES,
  PRIORITY_LEVELS,
  ISSUE_TYPES,
  PRIORITY_STYLES,
  STATUS_STYLES,
  REASON_TO_ISSUE_TYPE,
  PRIORITY_WEIGHTS,
};
