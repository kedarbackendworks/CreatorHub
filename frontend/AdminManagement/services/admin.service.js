const crypto = require('crypto');
const Admin = require('../models/AdminModel');
const User = require('../../../backend/models/User');
const { ASSIGNABLE_ROLES, ROLES } = require('../utils/adminConstants');
const { getAvatarColor, getInitials } = require('../utils/adminHelpers');
const { hashPassword } = require('./adminAuth.service');

/**
 * Ensure a linked Admin profile exists for a logged-in admin user.
 * Bootstraps first profile as super_admin.
 * @param {{_id: string, email: string, name: string, role: string}} requester
 * @returns {Promise<import('mongoose').Document|null>}
 */
async function ensureRequesterAdminProfile(requester) {
  if (!requester || requester.role !== 'admin') return null;

  let profile = await Admin.findOne({ email: requester.email.toLowerCase() });
  if (profile) {
    const superAdminCount = await Admin.countDocuments({ role: 'super_admin' });
    if (superAdminCount === 0 && profile.role !== 'super_admin') {
      profile.role = 'super_admin';
      await profile.save();
    }
    return profile;
  }

  const total = await Admin.countDocuments({});
  const generatedPassword = crypto.randomBytes(20).toString('hex') + '!A1';
  const usernameBase = (requester.email || requester.name || 'admin')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .slice(0, 24) || 'admin';

  const role = total === 0 ? 'super_admin' : 'moderator';

  profile = await Admin.create({
    name: requester.name || 'Admin User',
    username: `${usernameBase}_${String(requester._id).slice(-4)}`,
    email: requester.email.toLowerCase(),
    password: await hashPassword(generatedPassword),
    role,
    status: 'active',
    avatarInitials: getInitials(requester.name || 'Admin User'),
    avatarColor: getAvatarColor(usernameBase),
    addedBy: null,
  });

  const superAdminCount = await Admin.countDocuments({ role: 'super_admin' });
  if (superAdminCount === 0 && profile.role !== 'super_admin') {
    profile.role = 'super_admin';
    await profile.save();
  }

  return profile;
}

/**
 * Get admin list + stats in a single DB round trip.
 * @param {{role?: string, status?: string, sortBy?: string, page?: number, limit?: number}} params
 */
async function getAdmins(params = {}) {
  const role = params.role && params.role !== 'all' ? params.role : undefined;
  const status = params.status && params.status !== 'all' ? params.status : undefined;
  const sortBy = params.sortBy === 'recentlyAdded' ? 'recentlyAdded' : 'lastActive';
  const page = Math.max(Number(params.page || 1), 1);
  const limit = Math.min(Math.max(Number(params.limit || 10), 1), 100);
  const skip = (page - 1) * limit;

  const match = {};
  if (role && ROLES.includes(role)) match.role = role;
  if (status && ['active', 'inactive'].includes(status)) match.status = status;

  const sortStage = sortBy === 'recentlyAdded'
    ? { createdAt: -1 }
    : { lastActiveAt: -1 };

  const [facet] = await Admin.aggregate([
    {
      $facet: {
        admins: [
          { $match: match },
          { $sort: sortStage },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'admins',
              localField: 'addedBy',
              foreignField: '_id',
              as: 'addedByAdmin',
            },
          },
          {
            $addFields: {
              addedByName: { $ifNull: [{ $arrayElemAt: ['$addedByAdmin.name', 0] }, 'System'] },
            },
          },
          {
            $project: {
              password: 0,
              addedByAdmin: 0,
            },
          },
        ],
        roleStats: [{ $group: { _id: '$role', count: { $sum: 1 } } }],
        totalMatched: [{ $match: match }, { $count: 'count' }],
      },
    },
  ]);

  const stats = {
    super_admin: 0,
    moderator: 0,
    support: 0,
    finance: 0,
  };

  for (const row of facet?.roleStats || []) {
    if (stats[row._id] !== undefined) stats[row._id] = row.count;
  }

  const total = facet?.totalMatched?.[0]?.count || 0;

  return {
    admins: facet?.admins || [],
    stats,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}

/**
 * Create admin account.
 * @param {{name: string, username: string, email?: string, password: string, role: string, addedBy?: string}} payload
 */
async function createAdmin(payload) {
  const name = String(payload.name || '').trim();
  const username = String(payload.username || '').trim().toLowerCase();
  const password = String(payload.password || '');
  const role = String(payload.role || '').trim();

  if (!/^[a-zA-Z\s'-]{2,60}$/.test(name)) {
    const err = new Error('Name must be 2-60 chars and contain only letters, spaces, apostrophes and hyphens.');
    err.statusCode = 400;
    throw err;
  }

  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    const err = new Error('Lowercase letters, numbers and underscores only (3-30 chars).');
    err.statusCode = 400;
    throw err;
  }

  const strongPassword =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^a-zA-Z0-9]/.test(password);

  if (!strongPassword) {
    const err = new Error('Password must be at least 8 chars with uppercase, number, and special character.');
    err.statusCode = 400;
    throw err;
  }

  if (role === 'super_admin') {
    const err = new Error('Super Admin role cannot be assigned via this endpoint.');
    err.statusCode = 403;
    throw err;
  }
  if (!ASSIGNABLE_ROLES.includes(role)) {
    const err = new Error('Invalid role.');
    err.statusCode = 400;
    throw err;
  }

  const usernameExists = await Admin.findOne({ username });
  if (usernameExists) {
    const err = new Error('Username already taken.');
    err.statusCode = 409;
    throw err;
  }

  const email = (payload.email || `${username}@creatorhub.local`).toLowerCase();
  const emailExists = await Admin.findOne({ email });
  if (emailExists) {
    const err = new Error('Email already in use.');
    err.statusCode = 409;
    throw err;
  }

  const admin = await Admin.create({
    name,
    username,
    email,
    password: await hashPassword(password),
    role,
    status: 'active',
    avatarInitials: getInitials(name),
    avatarColor: getAvatarColor(username),
    addedBy: payload.addedBy || null,
  });

  let linkedUser = await User.findOne({ email });
  if (!linkedUser) {
    let userUsername = username;
    let usernameSuffix = 0;
    while (await User.findOne({ username: userUsername })) {
      usernameSuffix += 1;
      userUsername = `${username}_${usernameSuffix}`.slice(0, 30);
    }

    let phone = `8${String(Date.now()).slice(-9)}`;
    let phoneSuffix = 0;
    while (await User.findOne({ phone })) {
      phoneSuffix += 1;
      phone = `8${String(Date.now() + phoneSuffix).slice(-9)}`;
    }

    await User.create({
      name,
      username: userUsername,
      phone,
      email,
      password,
      role: 'admin',
      isVerified: true,
    });
  } else {
    linkedUser.role = 'admin';
    linkedUser.name = name;
    linkedUser.password = password;
    linkedUser.isVerified = true;
    await linkedUser.save();
  }

  return admin.toJSON();
}

/**
 * Get single admin detail.
 * @param {string} id
 */
async function getAdminById(id) {
  const admin = await Admin.findById(id).lean();
  if (!admin) {
    const err = new Error('Admin not found.');
    err.statusCode = 404;
    throw err;
  }
  delete admin.password;

  if (admin.addedBy) {
    const addedBy = await Admin.findById(admin.addedBy).select('name').lean();
    admin.addedByName = addedBy?.name || 'System';
  } else {
    admin.addedByName = 'System';
  }

  return admin;
}

/**
 * Update admin profile fields.
 * @param {string} id
 * @param {{role?: string, status?: string, name?: string, password?: string}} updates
 * @param {{_id: string, role: string}} requesterProfile
 */
async function updateAdmin(id, updates, requesterProfile) {
  const target = await Admin.findById(id);
  if (!target) {
    const err = new Error('Admin not found.');
    err.statusCode = 404;
    throw err;
  }

  const clean = { ...updates };
  delete clean.password;
  delete clean.email;
  delete clean.username;

  if (clean.role === 'super_admin') {
    const err = new Error('Super Admin role cannot be assigned or modified through this endpoint.');
    err.statusCode = 403;
    throw err;
  }

  if (target.role === 'super_admin') {
    const isSelf = String(target._id) === String(requesterProfile._id);
    if (!requesterProfile || requesterProfile.role !== 'super_admin' || isSelf) {
      const err = new Error('Cannot edit this super admin account.');
      err.statusCode = 403;
      throw err;
    }
  }

  if (clean.role && !ASSIGNABLE_ROLES.includes(clean.role) && clean.role !== target.role) {
    const err = new Error('Invalid role update.');
    err.statusCode = 400;
    throw err;
  }

  if (clean.status && !['active', 'inactive'].includes(clean.status)) {
    const err = new Error('Invalid status update.');
    err.statusCode = 400;
    throw err;
  }

  if (clean.name) {
    target.name = String(clean.name).trim();
    target.avatarInitials = getInitials(target.name);
  }
  if (clean.role) target.role = clean.role;
  if (clean.status) target.status = clean.status;

  await target.save();
  return target.toJSON();
}

/**
 * Delete admin.
 * @param {string} id
 * @param {{_id: string}} requesterProfile
 */
async function deleteAdmin(id, requesterProfile) {
  const target = await Admin.findById(id);
  if (!target) {
    const err = new Error('Admin not found.');
    err.statusCode = 404;
    throw err;
  }

  if (target.role === 'super_admin') {
    const err = new Error('Cannot delete a super_admin account.');
    err.statusCode = 403;
    throw err;
  }

  if (String(target._id) === String(requesterProfile._id)) {
    const err = new Error('Cannot delete your own account.');
    err.statusCode = 403;
    throw err;
  }

  await Admin.deleteOne({ _id: id });
  return { success: true };
}

/**
 * Update last active for current admin.
 * @param {string} id
 */
async function updateLastActive(id) {
  await Admin.findByIdAndUpdate(id, { $set: { lastActiveAt: new Date() } });
  return { success: true };
}

/**
 * Resolve requester admin profile from JWT user.
 * @param {{_id: string, email: string, name: string, role: string}} requesterUser
 */
async function resolveRequesterProfile(requesterUser) {
  if (!requesterUser || requesterUser.role !== 'admin') {
    const err = new Error('Not authorized for admin management.');
    err.statusCode = 403;
    throw err;
  }

  const profile = await ensureRequesterAdminProfile(requesterUser);
  if (!profile) {
    const err = new Error('Admin profile not found.');
    err.statusCode = 404;
    throw err;
  }

  return profile;
}

module.exports = {
  getAdmins,
  createAdmin,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  updateLastActive,
  resolveRequesterProfile,
  ensureRequesterAdminProfile,
};
