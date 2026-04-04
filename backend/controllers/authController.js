const User = require('../models/User');
const Creator = require('../models/Creator');
const Admin = require('../../frontend/AdminManagement/models/AdminModel');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { checkFlagged } = require('../../frontend/Moderation/services/flaggedIdentity.service');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// Helper: Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: Send OTP email
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@logoipsum.app',
    to: email,
    subject: 'Your Logoipsum Verification Code',
    text: `Your verification code is: ${otp}. It expires in 5 minutes.`,
    html: `<div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:32px;">
      <h2 style="color:#1a1a1a;">Verify your email</h2>
      <p style="color:#5a5a5a;">Your verification code is:</p>
      <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#e14517;margin:24px 0;">${otp}</div>
      <p style="color:#9a9a9a;font-size:14px;">This code expires in 5 minutes.</p>
    </div>`,
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, role, username, phone, deviceFingerprint } = req.body;

  try {
    const flagged = await checkFlagged({
      email,
      phone,
      username,
      deviceFingerprint,
    });

    if (flagged) {
      return res.status(403).json({
        message: 'Account creation is not available.',
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP
    const otp = generateOtp();

    const user = await User.create({
      name,
      username: username || name.toLowerCase().replace(/\s+/g, ''),
      phone: phone || '',
      email,
      password,
      role: role || 'user',
      otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    if (user) {
      // Send OTP email
      try {
        await sendOtpEmail(email, otp);
      } catch (emailErr) {
        console.error('OTP email failed:', emailErr.message);
        // Don't fail registration if email fails — user can resend
      }

      res.status(201).json({
        success: true,
        message: 'Account created. Check your email for verification code.',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        countryOfResidence: user.countryOfResidence,
        token: generateToken(user._id),
      });
      return;
    }

    // Fallback: allow AdminManagement credentials to log in via shared auth.
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin || admin.status !== 'active') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isAdminPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isAdminPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let linkedUser = await User.findOne({ email: normalizedEmail });
    if (!linkedUser) {
      const baseUsername = (admin.username || normalizedEmail.split('@')[0] || 'admin')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .slice(0, 24) || 'admin';

      let username = baseUsername;
      let usernameSuffix = 0;
      while (await User.findOne({ username })) {
        usernameSuffix += 1;
        username = `${baseUsername}_${usernameSuffix}`.slice(0, 30);
      }

      let phone = `9${String(Date.now()).slice(-9)}`;
      let phoneSuffix = 0;
      while (await User.findOne({ phone })) {
        phoneSuffix += 1;
        phone = `9${String(Date.now() + phoneSuffix).slice(-9)}`;
      }

      linkedUser = await User.create({
        name: admin.name,
        username,
        phone,
        email: normalizedEmail,
        password,
        role: 'admin',
        isVerified: true,
      });
    } else if (linkedUser.role !== 'admin') {
      linkedUser.role = 'admin';
      await linkedUser.save();
    }

    return res.json({
      _id: linkedUser._id,
      name: linkedUser.name,
      email: linkedUser.email,
      role: linkedUser.role,
      avatar: linkedUser.avatar,
      countryOfResidence: linkedUser.countryOfResidence,
      token: generateToken(linkedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile (example protected route)
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          countryOfResidence: user.countryOfResidence,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get deterministic conversation encryption key
// @route   GET /api/auth/conversation-key/:conversationId
// @access  Private
const getConversationKey = async (req, res) => {
  try {
    const secret = process.env.CONVERSATION_ENCRYPTION_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Conversation encryption secret is not configured' });
    }

    const key = crypto
      .createHmac('sha256', secret)
      .update(req.params.conversationId)
      .digest('hex');

    res.json({ key });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send forgot password email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@renown.app',
      to: user.email,
      subject: 'Reset your Renown password',
      text: `You requested a password reset. Use this link to continue: ${resetLink}`,
      html: `<p>You requested a password reset.</p><p>Use this link to continue:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(user._id, {
      $set: { password: hashedPassword },
      $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request OTP (resend)
// @route   POST /api/auth/request-otp
// @access  Public
const requestOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.json({ success: true, message: 'Email already verified' });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    try {
      await sendOtpEmail(email, otp);
    } catch (emailErr) {
      console.error('OTP email failed:', emailErr.message);
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check OTP
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check expiry
    if (user.otpExpires && user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Mark as verified, clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // If creator, create creator profile
    if (user.role === 'creator') {
      const existingCreator = await Creator.findOne({ userId: user._id.toString() });
      if (!existingCreator) {
        await Creator.create({
          userId: user._id.toString(),
          name: user.name,
          username: user.name.toLowerCase().replace(/\s+/g, ''),
        });
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        countryOfResidence: user.countryOfResidence,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set user role (after verification)
// @route   PATCH /api/auth/set-role
// @access  Private
const setRole = async (req, res) => {
  const { role } = req.body;

  if (!['user', 'creator'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be user or creator.' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save({ validateBeforeSave: false });

    // If creator, create creator profile
    if (role === 'creator') {
      const existingCreator = await Creator.findOne({ userId: user._id.toString() });
      if (!existingCreator) {
        await Creator.create({
          userId: user._id.toString(),
          name: user.name,
          username: user.username || user.name.toLowerCase().replace(/\s+/g, ''),
        });
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        countryOfResidence: user.countryOfResidence,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getConversationKey,
  forgotPassword,
  resetPassword,
  requestOtp,
  verifyOtp,
  setRole,
};
