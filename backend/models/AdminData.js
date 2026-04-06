const mongoose = require('mongoose');

// Users Model
const appUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['creator', 'user', 'admin'], default: 'user' },
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
  // General
  platformName: { type: String, default: 'Nexus Enterprise' },
  platformUrl: { type: String, default: 'https://admin.nexus-ent.com' },
  defaultLanguage: { type: String, default: 'English (US)' },
  timezone: { type: String, default: '(GMT+05:30) India Standard Time' },

  // Legal
  termsOfService: { type: String, default: '## Platform Usage Rules\n1. Users must be 18+...\n2. All content must comply with global standards...' },
  privacyPolicy: { type: String, default: '## Data Privacy\nWe value your data security. This document outlines how we process information...' },

  // Payments
  commission: { type: Number, default: 10 },
  transactionFee: { type: Number, default: 2 },
  minPayout: { type: Number, default: 1000 },
  currency: { type: String, default: 'INR' },
  razorpayConnected: { type: Boolean, default: false },
  stripeConnected: { type: Boolean, default: false },

  // Security
  twoFactorEnabled: { type: Boolean, default: true },
  botProtectionEnabled: { type: Boolean, default: false },
  sessionTimeout: { type: String, default: '30 Minutes' },
  minPasswordLength: { type: Number, default: 12 },
  blockedEmailDomains: [{ type: String, trim: true, lowercase: true }],

  // Feature Toggles (existing)
  toggles: {
    livestreaming: { type: Boolean, default: true },
    messaging: { type: Boolean, default: true },
    tips: { type: Boolean, default: true },
    contentLock: { type: Boolean, default: false },
    community: { type: Boolean, default: true }
  },

  // Subscription Plans (existing)
  subscriptionPlans: [{
    id: String,
    tierName: String,
    planName: String,
    price: mongoose.Schema.Types.Mixed,
    frequency: String,
    features: [String],
    isRecommended: Boolean
  }]
});
const AppSetting = mongoose.model('AppSetting', appSettingSchema);

// Dashboard Meta Model
const appDashboardSchema = new mongoose.Schema({
  users: { count: String, growth: String, data: Array },
  creators: { count: String, growth: String, data: Array },
  revenue: { count: String, growth: String, data: Array },
  subscriptions: { count: String, growth: String, data: Array },
  revenueOverTime: Array,
  revenueWeekly: Array,
  userGrowth: Array,
  payoutsData: Array,
  topCreators: Array,
  recentActivities: Array,
  miniStats: { flaggedContentCount: Number, verificationRequestsCount: Number },
  systemAlert: { 
    type: { type: String }, 
    description: String, 
    isVisible: Boolean, 
    priority: String 
  }
});
const AppDashboard = mongoose.model('AppDashboard', appDashboardSchema);

module.exports = { AppUser, AppReport, AppTransaction, AppTicket, AppSetting, AppDashboard };
