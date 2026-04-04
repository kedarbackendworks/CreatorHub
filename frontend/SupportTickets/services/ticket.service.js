const { Ticket, TicketCounter } = require('../models/TicketModel');
const Report = require('../../Moderation/models/ReportModel');
const Post = require('../../../backend/models/Post');
const Message = require('../../../backend/models/Message');
const User = require('../../../backend/models/User');
const { calcPriority, formatTicketId } = require('../utils/ticketHelpers');
const { REASON_TO_ISSUE_TYPE } = require('../utils/ticketConstants');
const { createNotification } = require('../../Moderation/services/notification.service');
const { log } = require('../../Moderation/services/adminLog.service');

async function nextTicketId() {
  const counter = await TicketCounter.findOneAndUpdate(
    { key: 'support_ticket' },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return formatTicketId(counter.seq);
}

/**
 * Sync/create ticket from report lifecycle event.
 */
async function syncFromReport(reportId) {
  const report = await Report.findById(reportId).lean();
  if (!report) return null;

  const issueType = REASON_TO_ISSUE_TYPE[report.reason] || 'other';
  const reporterCount = (report.additionalReporters?.length || 0) + 1;
  const priority = calcPriority(report);

  let ticket = await Ticket.findOne({ reportId: report._id });
  if (!ticket) {
    ticket = await Ticket.create({
      ticketId: await nextTicketId(),
      reportId: report._id,
      sourceType: 'user_report',
      status: 'open',
      priority,
      issueType,
      reporterCount,
      lastActivityAt: new Date(),
    });
    return ticket;
  }

  ticket.priority = priority;
  ticket.issueType = issueType;
  ticket.reporterCount = reporterCount;
  ticket.lastActivityAt = new Date();
  await ticket.save();
  return ticket;
}

async function autoAssignStaleOpenTickets(requesterAdminId) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const stale = await Ticket.find({ status: 'open', assignedTo: null, createdAt: { $lte: oneHourAgo } })
    .select('ticketId')
    .lean();
  if (!stale.length) return;

  const { autoAssign } = require('./ticketAssign.service');
  for (const t of stale) {
    try {
      await autoAssign(t.ticketId, requesterAdminId);
    } catch (_e) {
      // ignore assignment failure per ticket
    }
  }
}

/**
 * Get paginated tickets by status.
 */
async function getTickets({ status = 'open', page = 1, limit = 10, requesterAdminId = null }) {
  const cleanStatus = ['open', 'in_progress', 'resolved', 'dismissed'].includes(status) ? status : 'open';
  const p = Math.max(Number(page || 1), 1);
  const l = Math.min(Math.max(Number(limit || 10), 1), 50);

  await autoAssignStaleOpenTickets(requesterAdminId);

  const query = { status: cleanStatus };
  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .select('-adminResponse -respondedAt')
      .sort({ lastActivityAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .populate({
        path: 'reportId',
        select: 'targetType reason comment targetId reportedBy additionalReporters',
        populate: { path: 'reportedBy', select: 'name email' },
      })
      .populate({ path: 'submittedBy', select: 'name email role' })
      .populate({ path: 'assignedTo', select: 'name avatarInitials avatarColor role' })
      .lean(),
    Ticket.countDocuments(query),
  ]);

  return {
    tickets,
    total,
    page: p,
    totalPages: Math.max(Math.ceil(total / l), 1),
  };
}

/**
 * Get full ticket detail.
 */
async function getTicketById(ticketId) {
  const ticket = await Ticket.findOne({ ticketId })
    .populate({
      path: 'reportId',
      select: 'targetType reason comment targetId reportedBy additionalReporters targetOwnerId createdAt',
      populate: { path: 'reportedBy', select: 'name email avatar' },
    })
    .populate({ path: 'submittedBy', select: 'name email role' })
    .populate({ path: 'assignedTo', select: 'name avatarInitials avatarColor role' })
    .populate({ path: 'assignedBy', select: 'name' })
    .populate({ path: 'resolvedBy', select: 'name' })
    .lean();

  if (!ticket) {
    const err = new Error('Ticket not found.');
    err.statusCode = 404;
    throw err;
  }

  const report = ticket.reportId;
  let targetContent = null;
  if (report?.targetType === 'post') {
    targetContent = await Post.findById(report.targetId).lean();
  } else if (report?.targetType === 'dm') {
    const message = await Message.findById(report.targetId).lean();
    if (message) {
      const thread = await Message.find({ conversationId: message.conversationId }).sort({ createdAt: 1 }).lean();
      targetContent = { message, thread };
    }
  } else if (report?.targetType === 'user') {
    targetContent = await User.findById(report.targetId).select('name email avatar role').lean();
  }

  return {
    ...ticket,
    targetContent,
  };
}

/**
 * Update ticket status and sync moderation report.
 */
async function updateTicketStatus(ticketId, status, adminId, resolutionNote = '') {
  const allowed = ['open', 'in_progress', 'resolved', 'dismissed'];
  if (!allowed.includes(status)) {
    const err = new Error('Invalid status');
    err.statusCode = 400;
    throw err;
  }

  const ticket = await Ticket.findOne({ ticketId }).populate('reportId');
  if (!ticket) {
    const err = new Error('Ticket not found.');
    err.statusCode = 404;
    throw err;
  }

  ticket.status = status;
  ticket.lastActivityAt = new Date();

  if (status === 'resolved') {
    ticket.resolvedBy = adminId;
    ticket.resolvedAt = new Date();
    ticket.resolutionNote = resolutionNote || '';
  }

  if (status === 'dismissed') {
    ticket.resolutionNote = resolutionNote || 'Dismissed by support';
  }

  await ticket.save();

  if (ticket.reportId) {
    if (status === 'resolved') ticket.reportId.status = 'resolved';
    if (status === 'dismissed') ticket.reportId.status = 'dismissed';
    if (status === 'in_progress') ticket.reportId.status = 'under_review';
    if (status === 'open') ticket.reportId.status = 'pending';
    await ticket.reportId.save();
  }

  const report = ticket.reportId;
  if (report?.reportedBy) {
    await createNotification(
      report.reportedBy,
      'report_update',
      status === 'dismissed' ? 'Report dismissed' : 'Report updated',
      status === 'dismissed'
        ? 'Your report was reviewed and dismissed.'
        : 'Your report has been reviewed by support.',
      { ticketId, status }
    );
  }

  await log(adminId, `ticket_${status}`, ticket._id, 'ticket', resolutionNote || status, { ticketId });
  return ticket;
}

/**
 * Escalate ticket to moderator or super admin.
 */
async function escalateTicket(ticketId, escalateTo, adminId) {
  if (!['moderator', 'super_admin'].includes(escalateTo)) {
    const err = new Error('Invalid escalation target.');
    err.statusCode = 400;
    throw err;
  }

  const ticket = await Ticket.findOne({ ticketId }).populate('reportId');
  if (!ticket) {
    const err = new Error('Ticket not found.');
    err.statusCode = 404;
    throw err;
  }

  ticket.escalatedTo = escalateTo;
  ticket.lastActivityAt = new Date();
  await ticket.save();

  if (escalateTo === 'moderator' && ticket.reportId) {
    ticket.reportId.status = 'under_review';
    await ticket.reportId.save();
  }

  await log(adminId, 'ticket_escalated', ticket._id, 'ticket', `Escalated to ${escalateTo}`, {
    ticketId,
    escalateTo,
  });

  return ticket;
}

async function respondToTicket(ticketId, adminResponse, adminId) {
  const cleanResponse = String(adminResponse || '').trim();
  if (!cleanResponse) {
    const err = new Error('Admin response is required.');
    err.statusCode = 400;
    throw err;
  }

  const ticket = await Ticket.findOne({ ticketId });
  if (!ticket) {
    const err = new Error('Ticket not found.');
    err.statusCode = 404;
    throw err;
  }

  ticket.adminResponse = cleanResponse;
  ticket.respondedAt = new Date();
  ticket.lastActivityAt = new Date();
  if (ticket.status === 'open') {
    ticket.status = 'in_progress';
  }
  await ticket.save();

  if (ticket.submittedBy) {
    await createNotification(
      ticket.submittedBy,
      'report_update',
      `Admin responded to ticket ${ticket.ticketId}`,
      cleanResponse,
      { ticketId: ticket.ticketId, event: 'ticket_responded' }
    );
  }

  await log(adminId, 'ticket_responded', ticket._id, 'ticket', cleanResponse, { ticketId: ticket.ticketId });
  return ticket;
}

module.exports = {
  syncFromReport,
  getTickets,
  getTicketById,
  updateTicketStatus,
  escalateTicket,
  respondToTicket,
};
