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
const { getCaptchaConfig, requireCaptchaIfEnabled } = require('../middleware/captchaMiddleware');
const { checkBan } = require('../../frontend/Moderation/middleware/checkBan.middleware');

router.get('/captcha/config', getCaptchaConfig);
router.post('/register', requireCaptchaIfEnabled('creating an account'), registerUser);
router.post('/login', requireCaptchaIfEnabled('logging in'), loginUser);
router.post('/forgot-password', requireCaptchaIfEnabled('requesting a password reset'), forgotPassword);
router.post('/reset-password', requireCaptchaIfEnabled('resetting your password'), resetPassword);
router.post('/request-otp', requireCaptchaIfEnabled('requesting an OTP'), requestOtp);
router.post('/verify-otp', requireCaptchaIfEnabled('verifying OTP'), verifyOtp);
router.patch('/set-role', protect, checkBan, setRole);
router.get('/profile', protect, checkBan, getUserProfile);
router.get('/conversation-key/:conversationId', protect, checkBan, getConversationKey);

module.exports = router;
