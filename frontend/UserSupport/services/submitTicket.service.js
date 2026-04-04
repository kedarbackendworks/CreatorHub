const { Ticket, TicketCounter } = require('../../SupportTickets/models/TicketModel');
const { formatTicketId } = require('../../SupportTickets/utils/ticketHelpers');
const { createNotification } = require('../../Moderation/services/notification.service');
const { TICKET_TAGS, TAG_TO_ISSUE_TYPE, TAG_PRIORITY } = require('../utils/supportConstants');
const { validateAttachments } = require('../utils/supportHelpers');

async function nextTicketId() {
  const counter = await TicketCounter.findOneAndUpdate(
    { key: 'support_ticket' },
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return formatTicketId(counter.seq);
}

async function createTicket({ submittedBy, submitterRole, tag, heading, description, attachments = [] }) {
  const cleanTag = String(tag || '').trim().toLowerCase();
  const cleanHeading = String(heading || '').trim();
  const cleanDescription = String(description || '').trim();

  if (!submittedBy) {
    const err = new Error('Submitter is required.');
    err.statusCode = 400;
    throw err;
  }

  if (!['user', 'creator'].includes(submitterRole)) {
    const err = new Error('Invalid submitter role.');
    err.statusCode = 400;
    throw err;
  }

  if (!TICKET_TAGS.includes(cleanTag)) {
    const err = new Error('Invalid ticket category.');
    err.statusCode = 400;
    throw err;
  }

  if (!cleanHeading) {
    const err = new Error('Heading is required.');
    err.statusCode = 400;
    throw err;
  }

  if (cleanHeading.length > 120) {
    const err = new Error('Heading must be at most 120 characters.');
    err.statusCode = 400;
    throw err;
  }

  if (cleanDescription.length < 20 || cleanDescription.length > 2000) {
    const err = new Error('Description must be between 20 and 2000 characters.');
    err.statusCode = 400;
    throw err;
  }

  const attachmentValidation = validateAttachments(attachments);
  if (!attachmentValidation.valid) {
    const err = new Error('Invalid attachments.');
    err.statusCode = 400;
    err.fileErrors = attachmentValidation.errors;
    throw err;
  }

  const ticket = await Ticket.create({
    ticketId: await nextTicketId(),
    sourceType: 'user_submitted',
    submittedBy,
    submitterRole,
    tag: cleanTag,
    heading: cleanHeading,
    description: cleanDescription,
    attachments,
    status: 'open',
    priority: TAG_PRIORITY[cleanTag],
    issueType: TAG_TO_ISSUE_TYPE[cleanTag],
    assignedTo: null,
    reportId: null,
    reporterCount: 1,
    lastActivityAt: new Date(),
  });

  await createNotification(
    submittedBy,
    'report_update',
    `Ticket #${ticket.ticketId} received`,
    "We'll review your issue and get back to you.",
    { ticketId: ticket.ticketId, event: 'ticket_received' }
  );

  return ticket;
}

module.exports = {
  createTicket,
};
