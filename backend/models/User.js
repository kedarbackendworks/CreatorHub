const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'creator', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    countryOfResidence: { type: String, default: 'All courses' },
    isVerified: { type: Boolean, default: false },
    bio: { type: String, default: '' },
    resetPasswordToken: { type: String, default: '' },
    resetPasswordExpires: { type: Date },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    memberships: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Creator' }],
    lastLogin: { type: Date, default: Date.now },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
