const {
  createReportSchema,
  adminActionSchema,
  createReport,
  getMyReports,
  getAdminReports,
  getAdminReportById,
  takeAdminAction
} = require('./reports.service');

const getAuthUserId = (req) => req.user?.userId || req.user?._id;

const handleError = (res, error) => {
  if (error?.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.issues
    });
  }

  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Something went wrong'
  });
};

const createReportHandler = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const payload = createReportSchema.parse(req.body);
    const result = await createReport({ userId, payload });

    return res.status(201).json({
      success: true,
      message: result.message,
      report: result.report
    });
  } catch (error) {
    return handleError(res, error);
  }
};

const getMyReportsHandler = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const result = await getMyReports({ userId, query: req.query });
    return res.json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error);
  }
};

const getAdminReportsHandler = async (req, res) => {
  try {
    const result = await getAdminReports({ query: req.query });
    return res.json({ success: true, ...result });
  } catch (error) {
    return handleError(res, error);
  }
};

const getAdminReportByIdHandler = async (req, res) => {
  try {
    const report = await getAdminReportById(req.params.id);
    return res.json({ success: true, report });
  } catch (error) {
    return handleError(res, error);
  }
};

const takeAdminActionHandler = async (req, res) => {
  try {
    const adminUserId = getAuthUserId(req);
    if (!adminUserId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const payload = adminActionSchema.parse(req.body);
    const result = await takeAdminAction({
      reportId: req.params.id,
      adminUserId,
      payload
    });

    return res.json({
      success: true,
      message: 'Report action completed',
      ...result
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  createReportHandler,
  getMyReportsHandler,
  getAdminReportsHandler,
  getAdminReportByIdHandler,
  takeAdminActionHandler
};
