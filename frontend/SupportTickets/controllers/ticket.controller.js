const ticketService = require('../services/ticket.service');
const ticketStatsService = require('../services/ticketStats.service');
const ticketAssignService = require('../services/ticketAssign.service');

/**
 * GET /api/support/stats
 */
async function getStats(req, res) {
  try {
    const stats = await ticketStatsService.getStats();
    return res.status(200).json(stats);
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to fetch support stats.' });
  }
}

/**
 * GET /api/support/tickets
 */
async function listTickets(req, res) {
  try {
    const data = await ticketService.getTickets({
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
      requesterAdminId: req.adminProfile?._id,
    });
    return res.status(200).json({ ...data, adminRole: req.adminRole });
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to fetch tickets.' });
  }
}

/**
 * GET /api/support/tickets/:ticketId
 */
async function getTicket(req, res) {
  try {
    const ticket = await ticketService.getTicketById(req.params.ticketId);
    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Unable to fetch ticket.' });
  }
}

/**
 * PATCH /api/support/tickets/:ticketId/status
 */
async function patchTicketStatus(req, res) {
  try {
    const { status, resolutionNote } = req.body;
    const ticket = await ticketService.getTicketById(req.params.ticketId);

    if (req.adminRole === 'support') {
      const assignedTo = ticket.assignedTo?._id || ticket.assignedTo;
      const isOpen = ticket.status === 'open' && !assignedTo;
      const isAssignedToSelf = String(assignedTo || '') === String(req.adminProfile?._id || '');
      if (!(isOpen || isAssignedToSelf)) {
        return res.status(403).json({ message: 'Support can only act on open or self-assigned tickets.' });
      }
    }

    const updated = await ticketService.updateTicketStatus(
      req.params.ticketId,
      status,
      req.adminProfile._id,
      resolutionNote
    );

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Unable to update ticket status.' });
  }
}

/**
 * PATCH /api/support/tickets/:ticketId/assign
 */
async function assignTicket(req, res) {
  try {
    const { assignToAdminId } = req.body;
    if (!assignToAdminId || assignToAdminId === 'auto') {
      const auto = await ticketAssignService.autoAssign(req.params.ticketId, req.adminProfile._id);
      return res.status(200).json(auto || { message: 'No support admin available for auto-assignment.' });
    }

    const ticket = await ticketAssignService.assignTicket(
      req.params.ticketId,
      assignToAdminId,
      req.adminProfile._id
    );
    return res.status(200).json(ticket);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Unable to assign ticket.' });
  }
}

/**
 * PATCH /api/support/tickets/:ticketId/escalate
 */
async function escalateTicket(req, res) {
  try {
    const { escalateTo } = req.body;

    if (req.adminRole === 'support' && escalateTo === 'super_admin') {
      return res.status(403).json({ message: 'Support cannot escalate directly to super admin.' });
    }

    if (req.adminRole === 'support' && !['moderator'].includes(escalateTo)) {
      return res.status(403).json({ message: 'Support can only escalate to moderator.' });
    }

    const updated = await ticketService.escalateTicket(
      req.params.ticketId,
      escalateTo,
      req.adminProfile._id
    );
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Unable to escalate ticket.' });
  }
}

/**
 * PATCH /api/support/tickets/:ticketId/respond
 */
async function respondToTicket(req, res) {
  try {
    const { adminResponse } = req.body;
    const updated = await ticketService.respondToTicket(
      req.params.ticketId,
      adminResponse,
      req.adminProfile._id
    );
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || 'Unable to add response.' });
  }
}

module.exports = {
  getStats,
  listTickets,
  getTicket,
  patchTicketStatus,
  assignTicket,
  escalateTicket,
  respondToTicket,
};
