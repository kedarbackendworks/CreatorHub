const { Ticket } = require('../../SupportTickets/models/TicketModel');

function normalizePagination({ page = 1, limit = 10 }) {
  const p = Math.max(Number(page || 1), 1);
  const l = Math.min(Math.max(Number(limit || 10), 1), 50);
  return { page: p, limit: l };
}

async function getMyTickets(submittedBy, { page = 1, limit = 10, status }) {
  const { page: p, limit: l } = normalizePagination({ page, limit });
  const query = {
    submittedBy,
    sourceType: 'user_submitted',
  };

  if (status && ['open', 'in_progress', 'resolved', 'dismissed'].includes(status)) {
    query.status = status;
  }

  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .select('ticketId tag heading status priority createdAt adminResponse respondedAt attachments')
      .lean(),
    Ticket.countDocuments(query),
  ]);

  return {
    tickets: tickets.map((ticket) => ({
      ...ticket,
      attachmentsCount: Array.isArray(ticket.attachments) ? ticket.attachments.length : 0,
    })),
    total,
    page: p,
    totalPages: Math.max(Math.ceil(total / l), 1),
  };
}

async function getMyTicketById(ticketId, submittedBy) {
  const ticket = await Ticket.findOne({ ticketId, sourceType: 'user_submitted' }).lean();

  if (!ticket) {
    const err = new Error('Ticket not found.');
    err.statusCode = 404;
    throw err;
  }

  if (String(ticket.submittedBy || '') !== String(submittedBy || '')) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  return ticket;
}

module.exports = {
  getMyTickets,
  getMyTicketById,
};
