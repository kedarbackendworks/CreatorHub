const mongoose = require('mongoose');

// Users Model
const appUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['Creator', 'User', 'Admin', 'Moderator', 'Premium User'], default: 'User' },
  status: { type: String, enum: ['Active', 'Suspended', 'Pending'], default: 'Active' },
  avatar: { type: String },
  joined: { type: String },
  password: { type: String }
});
const AppUser = mongoose.model('AppUser', appUserSchema);

// Reports Model
const appReportSchema = new mongoose.Schema({
  title: String,
  creator: String,
  reason: String,
  status: { type: String, enum: ['Pending', 'Reviewed'] },
  img: String
});
const AppReport = mongoose.model('AppReport', appReportSchema);

// Transactions Model
const appTransactionSchema = new mongoose.Schema({
  txnId: String,
  user: String,
  initial: String,
  amount: String,
  status: String,
  date: String
});
const AppTransaction = mongoose.model('AppTransaction', appTransactionSchema);

// Tickets Model
const appTicketSchema = new mongoose.Schema({
  ticketId: String,
  user: String,
  issue: String,
  desc: String,
  priority: String,
  assigned: String,
  updated: String
});
const AppTicket = mongoose.model('AppTicket', appTicketSchema);

// Settings Model
const appSettingSchema = new mongoose.Schema({
  platformName: String,
  commission: Number,
  transactionFee: Number,
  minPayout: Number,
  currency: String,
  toggles: {
    livestream: Boolean,
    courses: Boolean,
    tips: Boolean,
    dm: Boolean,
    forums: Boolean,
    AI: Boolean,
    ageRes: Boolean
  }
});
const AppSetting = mongoose.model('AppSetting', appSettingSchema);

// Dashboard Meta Model
const appDashboardSchema = new mongoose.Schema({
  users: { count: String, growth: String, data: Array },
  creators: { count: String, growth: String, data: Array },
  revenue: { count: String, growth: String, data: Array },
  subscriptions: { count: String, growth: String, data: Array },
  revenueOverTime: Array,
  userGrowth: Array,
  payoutsData: Array
});
const AppDashboard = mongoose.model('AppDashboard', appDashboardSchema);

module.exports = { AppUser, AppReport, AppTransaction, AppTicket, AppSetting, AppDashboard };
