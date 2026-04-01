const express = require('express');
const router = express.Router();
const {
	registerUser,
	loginUser,
	getUserProfile,
	getConversationKey,
	forgotPassword,
	resetPassword,
	requestOtp,
	verifyOtp,
	setRole,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.patch('/set-role', protect, setRole);
router.get('/profile', protect, getUserProfile);
router.get('/conversation-key/:conversationId', protect, getConversationKey);

module.exports = router;
