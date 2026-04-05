const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { checkBan } = require('../../frontend/Moderation/middleware/checkBan.middleware');
const {
	getAllData,
	updateUser,
	deleteUser,
	getUserDetails,
	getDashboardData,
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

// Platform Settings
router.get('/platform/settings', getPlatformSettings);
router.put('/platform/settings/toggle', updatePlatformToggle);
router.put('/platform/plans/:id', updateSubscriptionPlan);

module.exports = router;
