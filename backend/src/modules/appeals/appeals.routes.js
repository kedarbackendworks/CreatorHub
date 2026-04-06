const express = require('express');
const { protect, authorize } = require('../../../middleware/authMiddleware');
const {
  uploadAppealAttachmentsMiddleware,
  createAppealHandler,
  getMyAppealHandler,
  getAdminAppealsHandler,
  getAdminAppealByIdHandler,
  decideAppealHandler
} = require('./appeals.controller');

const router = express.Router();

// Creator-facing (intentionally no checkBan middleware)
router.post('/appeals', protect, uploadAppealAttachmentsMiddleware, createAppealHandler);
router.get('/appeals/my-appeal', protect, getMyAppealHandler);

// Admin-facing
router.get('/admin/appeals', protect, authorize('admin'), getAdminAppealsHandler);
router.get('/admin/appeals/:id', protect, authorize('admin'), getAdminAppealByIdHandler);
router.patch('/admin/appeals/:id/decision', protect, authorize('admin'), decideAppealHandler);

module.exports = router;
