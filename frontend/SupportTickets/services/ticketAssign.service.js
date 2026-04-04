const { Ticket } = require('../models/TicketModel');
const Admin = require('../../AdminManagement/models/AdminModel');
const { createNotification } = require('../../Moderation/services/notification.service');
const { log } = require('../../Moderation/services/adminLog.service');

/**
 * Assign ticket to support/moderator admin.
 */
async function assignTicket(ticketId, assignToAdminId, assignedByAdminId) {
  const assignee = await Admin.findById(assignToAdminId);
  if (!assignee || assignee.status !== 'active' || !['support', 'moderator'].includes(assignee.role)) {
    const err = new Error('Assignee must be an active support or moderator admin.');
    err.statusCode = 400;
    throw err;
  }

  const ticket = await Ticket.findOne({ ticketId });
  if (!ticket) {
    const err = new Error('Ticket not found.');
    err.statusCode = 404;
    throw err;
  }

  ticket.assignedTo = assignee._id;
  ticket.assignedBy = assignedByAdminId;
  ticket.assignedAt = new Date();
  ticket.lastActivityAt = new Date();
  if (ticket.status === 'open') ticket.status = 'in_progress';
  await ticket.save();

  await createNotification(
    assignee._id,
    'report_update',
    'Ticket assigned',
    `You were assigned ${ticket.ticketId}.`,
    { ticketId: ticket.ticketId }
  );

  await log(assignedByAdminId, 'ticket_assigned', ticket._id, 'ticket', 'Ticket assigned to admin', {
    ticketId: ticket.ticketId,
    assignedTo: assignee._id,
  });

  return ticket;
}

/**
 * Auto assign stale ticket to support admin with lowest active load.
 */
async function autoAssign(ticketId, assignedByAdminId = null) {
  const supports = await Admin.find({ role: 'support', status: 'active' }).select('_id').lean();
  if (!supports.length) return null;

  const ids = supports.map((x) => x._id);
  const loads = await Ticket.aggregate([
    { $match: { status: { $in: ['open', 'in_progress'] }, assignedTo: { $in: ids } } },
    { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
  ]);

  const map = new Map(loads.map((x) => [String(x._id), x.count]));
  let selected = ids[0];
  let min = Number.MAX_SAFE_INTEGER;
  for (const id of ids) {
    const c = map.get(String(id)) || 0;
    if (c < min) {
      min = c;
      selected = id;
    }
  }

  return assignTicket(ticketId, selected, assignedByAdminId || selected);
}

module.exports = {
  assignTicket,
  autoAssign,
};
