const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkBan } = require('../../frontend/Moderation/middleware/checkBan.middleware');
const { superAdminOnly } = require('../../frontend/AdminManagement/middleware/superAdminOnly.middleware');
const { approveEnterpriseHandler } = require('../../frontend/CreatorSubscription/controllers/subscription.controller');
const {
	createPost,
	getPosts,
	deletePost,
	updateSocialLinks,
	getSocialLinks,
} = require('../controllers/creatorController');
const {
	getAllData,
	updateUser,
	deleteUser,
	getUserDetails,
	getDashboardData,
	getCreatorsAnalyticsData,
	getRevenueAnalyticsData,
	getPlatformSettings,
	updatePlatformToggle,
	updateSubscriptionPlan,
	getSettings,
	saveSettings,
	 resetSettings,
	 getAdminSessions,
	 revokeAdminSession,
	 revokeAllOtherAdminSessions
} = require('../controllers/adminController');

router.use(protect);
router.use(checkBan);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardData);
router.get('/creators/analytics', getCreatorsAnalyticsData);
router.get('/revenue/analytics', getRevenueAnalyticsData);
router.get('/data', getAllData);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);
router.get('/user/:id', getUserDetails);
router.get('/settings', getSettings);
router.put('/settings', saveSettings);
router.post('/settings/reset', resetSettings);
router.get('/sessions', getAdminSessions);
router.delete('/sessions/:sessionId', revokeAdminSession);
router.delete('/sessions', revokeAllOtherAdminSessions);

// Content Management (admin-facing pages)
router.get('/posts', getPosts);
router.post('/posts', createPost);
router.delete('/posts/:id', deletePost);
router.get('/social-links', getSocialLinks);
router.post('/social-links', updateSocialLinks);

// Platform Settings
router.get('/platform/settings', getPlatformSettings);
router.put('/platform/settings/toggle', updatePlatformToggle);
router.put('/platform/plans/:id', updateSubscriptionPlan);
router.patch('/subscription/:subscriptionId/approve', superAdminOnly, approveEnterpriseHandler);

module.exports = router;
