const Ban = require('../models/Ban');
const Appeal = require('../models/Appeal');

const MS_PER_DAY = 86400000;

const checkBan = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?._id;
    if (!userId) {
      return next();
    }

    const activeBan = await Ban.getActiveBan(userId);
    if (!activeBan) {
      return next();
    }

    const hasNonApprovedAppeal = await Appeal.exists({
      banId: activeBan._id,
      status: { $ne: 'approved' }
    });

    const remainingDays = activeBan.banType === 'permanent' || !activeBan.endDate
      ? null
      : Math.ceil((new Date(activeBan.endDate).getTime() - Date.now()) / MS_PER_DAY);

    return res.status(403).json({
      success: false,
      code: 'ACCOUNT_BANNED',
      message: 'Your account has been suspended.',
      ban: {
        banType: activeBan.banType,
        reason: activeBan.reason,
        startDate: activeBan.startDate ? new Date(activeBan.startDate).toISOString() : null,
        endDate: activeBan.endDate ? new Date(activeBan.endDate).toISOString() : null,
        remainingDays,
        canAppeal: !Boolean(hasNonApprovedAppeal)
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { checkBan };
