const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkBan } = require('../middleware/checkBan');
const { checkFeatureToggle } = require('../middleware/featureToggleMiddleware');
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
router.put('/:id/start', protect, checkBan, checkFeatureToggle('livestreaming'), startStream);
router.put('/:id/end', protect, checkBan, checkFeatureToggle('livestreaming'), endStream);
router.post('/:id/chat', protect, checkBan, checkFeatureToggle('livestreaming'), saveChatMessage);

module.exports = router;
