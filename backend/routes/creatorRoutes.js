const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getDashboardData,
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  updateSocialLinks,
  getSocialLinks,
  getAnalytics,
  getSubscribers,
  getInsightsData,
  updateCreatorProfile,
  getNotifications,
  markAllCreatorNotificationsRead,
  markNotificationRead,
  getPayoutSettings,
  updatePayoutSettings,
  createLivestream,
  getLivestreams,
  getMessages,
  uploadMessageMediaHandler,
  sendMessage,
  deleteMessage,
  editMessage,
  reactToMessage,
  blockUser,
  getBlockStatus,
  markConversationSeen
} = require('../controllers/creatorController');

router.use(protect);
router.use(authorize('creator'));

router.get('/dashboard', getDashboardData);
router.put('/update-profile', updateCreatorProfile);
router.get('/analytics', getAnalytics);
router.get('/subscribers', getSubscribers);
router.get('/insights', getInsightsData);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/mark-all-read', markAllCreatorNotificationsRead);
router.put('/notifications/:id/read', markNotificationRead);

// Payouts
router.get('/payout-settings', getPayoutSettings);
router.put('/payout-settings', updatePayoutSettings);

// Livestreams
router.post('/livestreams', createLivestream);
router.get('/livestreams', getLivestreams);

// Messaging
router.get('/messages', getMessages);
router.post('/messages/upload-media', uploadMessageMediaHandler);
router.post('/messages', sendMessage);
router.put('/messages/seen/:conversationId', markConversationSeen);
router.put('/messages/:id/delete', deleteMessage);
router.put('/messages/:id/edit', editMessage);
router.post('/messages/:id/react', reactToMessage);
router.post('/block/:userId', blockUser);
router.get('/block/:userId', getBlockStatus);

// Post routing
router.post('/posts', createPost);
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

// Social links routing
router.get('/social-links', getSocialLinks);
router.post('/social-links', updateSocialLinks);

module.exports = router;
