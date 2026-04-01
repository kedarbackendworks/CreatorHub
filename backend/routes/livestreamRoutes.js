const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  startStream,
  endStream,
  getStreamById,
  getActiveStreams,
  getStreamsByCreator,
  saveChatMessage,
  getChatHistory,
} = require('../controllers/livestreamController');

// Public — list routes MUST come before :id to avoid route conflicts
router.get('/', getActiveStreams);
router.get('/creator/:creatorId', getStreamsByCreator);
router.get('/:id', getStreamById);
router.get('/:id/chat', getChatHistory);

// Protected
router.put('/:id/start', protect, startStream);
router.put('/:id/end', protect, endStream);
router.post('/:id/chat', protect, saveChatMessage);

module.exports = router;
