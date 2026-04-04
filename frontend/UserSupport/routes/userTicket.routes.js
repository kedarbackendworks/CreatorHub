const express = require('express');
const { protect } = require('../../../backend/middleware/authMiddleware');
const { checkBan } = require('../../Moderation/middleware/checkBan.middleware');
const {
  uploadAttachmentsMiddleware,
  createUserTicket,
  listMyTickets,
  getMyTicket,
} = require('../controllers/userTicket.controller');

const router = express.Router();

router.use(protect);
router.use(checkBan);
router.use((req, res, next) => {
  if (!['user', 'creator'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'Only users and creators can submit support tickets.' });
  }
  return next();
});

router.post('/tickets', uploadAttachmentsMiddleware, createUserTicket);
router.get('/tickets', listMyTickets);
router.get('/tickets/:ticketId', getMyTicket);

module.exports = router;
