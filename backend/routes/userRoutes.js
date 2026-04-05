const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkBan } = require('../../frontend/Moderation/middleware/checkBan.middleware');
const { checkFeatureToggle } = require('../middleware/featureToggleMiddleware');
const {
  getCreators,
  getCreatorProfile,
  getCreatorPosts,
  getPostDetails,
  toggleFollowCreator,
  getFollowingCreators,
  searchCreators,
  getLiveStreams,
  updateUserProfile,
  getUserNotifications,
  markUserNotificationRead,
  markAllUserNotificationsRead,
  reactToPost,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getCreatorReviews,
  addCreatorReview,
  getReviewReplies,
  addReviewReply,
  toggleFavoritePost,
  getFavoritePosts,
  toggleSubscription,
  purchaseExclusivePost
} = require('../controllers/userController');

const {
  getMessages,
  uploadMessageMediaHandler,
  sendMessage,
  deleteMessage,
  editMessage,
  reactToMessage,
  blockUser,
  getBlockStatus,
  markConversationSeen,
  getFeatureAvailability
} = require('../controllers/creatorController');

// Public routes
router.get('/creators', getCreators);
router.get('/creators/search', searchCreators);
router.get('/creators/:id', getCreatorProfile);
router.get('/creators/:id/posts', getCreatorPosts);
router.get('/creators/:id/reviews', getCreatorReviews);
router.get('/livestreams', getLiveStreams);
router.get('/posts/:id', getPostDetails);
router.get('/posts/:id/comments', getComments);
router.get('/reviews/:id/replies', getReviewReplies);

// Protected routes (for Fans/Users)
router.use(protect);
router.use(checkBan);
router.get('/features', getFeatureAvailability);
router.put('/update-profile', updateUserProfile);
router.get('/notifications', getUserNotifications);
router.put('/notifications/mark-all-read', markAllUserNotificationsRead);
router.put('/notifications/:id/read', markUserNotificationRead);
router.get('/messages', checkFeatureToggle('messaging'), getMessages);
router.post('/messages/upload-media', checkFeatureToggle('messaging'), uploadMessageMediaHandler);
router.post('/messages', checkFeatureToggle('messaging'), sendMessage);
router.put('/messages/seen/:conversationId', checkFeatureToggle('messaging'), markConversationSeen);
router.put('/messages/:id/delete', checkFeatureToggle('messaging'), deleteMessage);
router.put('/messages/:id/edit', checkFeatureToggle('messaging'), editMessage);
router.post('/messages/:id/react', reactToMessage);
router.post('/block/:userId', blockUser);
router.get('/block/:userId', getBlockStatus);
router.get('/following', getFollowingCreators);
router.post('/follow/:creatorId', toggleFollowCreator);
router.post('/subscribe/:creatorId', toggleSubscription);

// Additional post interactions
router.post('/posts/:id/react', reactToPost);
router.post('/posts/:id/favorite', toggleFavoritePost);
router.post('/posts/:id/purchase-exclusive', checkFeatureToggle('contentLock'), purchaseExclusivePost);
router.get('/favorites', getFavoritePosts);
router.post('/posts/:id/comments', addComment);
router.put('/comments/:commentId', updateComment);
router.delete('/comments/:commentId', deleteComment);

router.post('/creators/:id/reviews', addCreatorReview);

// Review replies
router.post('/reviews/:id/replies', addReviewReply);

module.exports = router;
