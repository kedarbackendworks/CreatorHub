const express = require('express');
const { protect, authorize } = require('../../../middleware/authMiddleware');
const {
  createReportHandler,
  getMyReportsHandler,
  getAdminReportsHandler,
  getAdminReportByIdHandler,
  takeAdminActionHandler
} = require('./reports.controller');

const router = express.Router();

router.post('/reports', protect, createReportHandler);
router.get('/reports/my-reports', protect, getMyReportsHandler);

router.get('/admin/reports', protect, authorize('admin'), getAdminReportsHandler);
router.get('/admin/reports/:id', protect, authorize('admin'), getAdminReportByIdHandler);
router.patch('/admin/reports/:id/action', protect, authorize('admin'), takeAdminActionHandler);

module.exports = router;
