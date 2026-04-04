const { PRIORITY_WEIGHTS, REASON_TO_ISSUE_TYPE } = require('./ticketConstants');

/**
 * Calculate ticket priority from report signal.
 * @param {{ reason: string, additionalReporters?: unknown[] }} report
 * @returns {'low'|'medium'|'high'}
 */
function calcPriority(report) {
  const reason = REASON_TO_ISSUE_TYPE[report?.reason] || 'other';
  const reporterCount = ((report?.additionalReporters || []).length || 0) + 1;

  let level = 'low';
  if (PRIORITY_WEIGHTS.highPriorityReasons.includes(reason)) {
    level = 'medium';
  }

  if (reporterCount >= PRIORITY_WEIGHTS.reporterCountThreshold.high) return 'high';
  if (reporterCount >= PRIORITY_WEIGHTS.reporterCountThreshold.medium) {
    return level === 'low' ? 'medium' : level;
  }

  return level;
}

/**
 * @param {number} seq
 */
function formatTicketId(seq) {
  return `TKT-${String(seq).padStart(6, '0')}`;
}

/**
 * @param {Date|string|number} dateInput
 */
function formatUpdated(dateInput) {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / (1000 * 60));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

/**
 * @param {string} comment
 * @param {number} maxLen
 */
function truncateDescription(comment = '', maxLen = 60) {
  if (!comment) return '';
  return comment.length > maxLen ? `${comment.slice(0, maxLen)}...` : comment;
}

module.exports = {
  calcPriority,
  formatTicketId,
  formatUpdated,
  truncateDescription,
};
