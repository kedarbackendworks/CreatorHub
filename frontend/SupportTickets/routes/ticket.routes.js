const express = require('express');
const { protect } = require('../../../backend/middleware/authMiddleware');
const { checkBan } = require('../../Moderation/middleware/checkBan.middleware');
const { supportOrAbove } = require('../middleware/supportOrAbove.middleware');
const {
  getStats,
  listTickets,
  getTicket,
  patchTicketStatus,
  assignTicket,
  escalateTicket,
  respondToTicket,
} = require('../controllers/ticket.controller');

const router = express.Router();
router.use(protect);
router.use(checkBan);
router.use(supportOrAbove);

router.get('/stats', getStats);
router.get('/tickets', listTickets);
router.get('/tickets/:ticketId', getTicket);
router.patch('/tickets/:ticketId/status', patchTicketStatus);
router.patch('/tickets/:ticketId/assign', assignTicket);
router.patch('/tickets/:ticketId/escalate', escalateTicket);
router.patch('/tickets/:ticketId/respond', respondToTicket);

module.exports = router;
