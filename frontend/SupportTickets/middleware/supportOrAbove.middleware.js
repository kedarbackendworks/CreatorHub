const { ensureRequesterAdminProfile } = require('../../AdminManagement/services/admin.service');

/**
 * Allows support, moderator and super_admin.
 */
async function supportOrAbove(req, res, next) {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const profile = await ensureRequesterAdminProfile(req.user);
    if (!profile || !['support', 'moderator', 'super_admin'].includes(profile.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    req.adminRole = profile.role;
    req.adminProfile = profile;
    return next();
  } catch (_error) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
}

module.exports = {
  supportOrAbove,
};
