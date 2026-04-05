const User = require('../models/User');
const Creator = require('../models/Creator');
const Wallet = require('../models/Wallet');

exports.getDashboardData = async (req, res) => {
  try {
    const [allUsers, allCreators, allWallets] = await Promise.all([
        User.find().sort({ createdAt: -1 }),
        Creator.find().sort({ 'earnings.total': -1 }),
        Wallet.find().populate('userId', 'name avatar')
    ]);
    
    // Aggregating Totals
    const totalUsersCount = allUsers.length;
    const activeCreatorsCount = allCreators.filter(c => c.status === 'active').length;
    
    let totalRevenue = 0;
    let pendingPayouts = 0;
    let allTransactions = [];

    // Extract transactions from wallets
    allWallets.forEach(wallet => {
      if (wallet.transactions && wallet.transactions.length > 0) {
        wallet.transactions.forEach(t => {
           allTransactions.push({ ...t.toObject(), user: wallet.userId });
           if (t.type === 'credit' && t.status === 'success') {
              totalRevenue += t.amount;
           }
           if (t.status === 'pending') {
              pendingPayouts += t.amount;
           }
        });
      }
    });

    const formatCurrency = (num) => new Intl.NumberFormat('en-IN').format(num);

    // Mini Stats
    const flaggedContentCount = 0; // Replace with Moderation/Report model when it exists
    const verificationRequestsCount = allUsers.filter(u => u.role === 'creator' && !u.isVerified).length;

    // Aggregating Charts
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const usersGrowthData = monthOrder.map(m => ({ name: m, val: 0 }));
    const creatorsGrowthData = monthOrder.map(m => ({ name: m, val: 0 }));
    const revenueOverTime = monthOrder.map(m => ({ name: m, val: 0 }));
    const revenueWeekly = [
      { name: 'Wk1', val: 0 }, { name: 'Wk2', val: 0 }, { name: 'Wk3', val: 0 }, { name: 'Wk4', val: 0 }
    ];

    allUsers.forEach(u => {
      const month = new Date(u.createdAt).toLocaleString('default', { month: 'short' });
      const mData = usersGrowthData.find(d => d.name === month);
      if (mData) {
        mData.val += 1;
        if (u.role === 'creator') {
          const cData = creatorsGrowthData.find(d => d.name === month);
          if (cData) cData.val += 1;
        }
      }
    });

    // Time-based sorting for transactions natively
    allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    allTransactions.forEach((t, i) => {
      if (t.type === 'credit' && t.status === 'success') {
        const month = new Date(t.createdAt).toLocaleString('default', { month: 'short' });
        const rData = revenueOverTime.find(d => d.name === month);
        if (rData) rData.val += t.amount;
        
        // Randomly scatter revenue into weekly array based on modulo for logic since we don't have exact week metrics natively plotted easily
        revenueWeekly[i % 4].val += t.amount;
      }
    });

    const colors = ['#6366F1', '#F97316', '#1F2937', '#10B981', '#EAB308'];
    const topCreators = allCreators.slice(0, 3).map((c, index) => ({
        initials: c.name ? c.name.substring(0, 2).toUpperCase() : 'CR',
        name: c.name || c.username,
        role: c.category || 'Creator',
        earnings: `₹${(c.earnings?.total / 1000 || 0).toFixed(1)}k`,
        rank: index + 1,
        color: colors[index % colors.length]
    }));

    // Dynamic Recent Activities based on real wallet transactions and real new users
    const recentActivities = [];
    allTransactions.slice(0, 3).forEach((t, index) => {
       const actionText = t.type === 'credit' ? `Received ₹${t.amount}` : `Withdrew ₹${t.amount}`;
       recentActivities.push({
           dot: t.status === 'success' ? '#10B981' : (t.status === 'pending' ? '#F97316' : '#DC2626'),
           text: `${t.user?.name || 'User'} - ${actionText}`,
           time: new Date(t.createdAt).toLocaleDateString()
       });
    });

    if (recentActivities.length === 0 && allUsers.length > 0) {
      allUsers.slice(0, 3).forEach(u => {
        recentActivities.push({ 
           dot: '#10B981', 
           text: `${u.name} registered as a ${u.role}`, 
           time: new Date(u.createdAt).toLocaleDateString() 
        });
      });
    }

    const dashboard = {
      users: { count: totalUsersCount.toLocaleString('en-US'), growth: '+2%', data: usersGrowthData.slice(0, 5) },
      creators: { count: activeCreatorsCount.toLocaleString('en-US'), growth: '+5%', data: creatorsGrowthData.slice(0, 5) },
      revenue: { count: `₹${formatCurrency(totalRevenue)}`, growth: '+8%', data: revenueOverTime.slice(0, 5) },
      subscriptions: { count: pendingPayouts.toLocaleString('en-US'), growth: '-1%', data: revenueOverTime.slice(0, 5) },
      revenueOverTime: revenueOverTime,
      revenueWeekly,
      topCreators,
      recentActivities,
      miniStats: { flaggedContentCount, verificationRequestsCount },
      systemAlert: null
    };

    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Legacy Endpoints for Other Admin Panels ---
const { AppUser, AppReport, AppTransaction, AppTicket, AppSetting, AppDashboard } = require('../models/AdminData');

exports.getAllData = async (req, res) => {
  try {
    const users = await AppUser.find();
    const reports = await AppReport.find();
    const transactions = await AppTransaction.find();
    const tickets = await AppTicket.find();
    const settings = await AppSetting.findOne();
    const dashboard = await AppDashboard.findOne();
    res.status(200).json({ users, reports, transactions, tickets, settings, dashboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, password } = req.body;
    const user = await AppUser.findByIdAndUpdate(id, { name, email, role, status, password }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await AppUser.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await AppSetting.findOneAndUpdate({}, req.body, { new: true });
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSettings = async (req, res) => {
  try {
    let settings = await AppSetting.findOne();
    if (!settings) {
      settings = new AppSetting();
      await settings.save();
    }
    res.status(200).json(settings.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.saveSettings = async (req, res) => {
  try {
    const allowed = [
      'platformName', 'platformUrl', 'defaultLanguage', 'timezone',
      'termsOfService', 'privacyPolicy',
      'commission', 'minPayout', 'currency', 'transactionFee',
      'razorpayConnected', 'stripeConnected',
      'twoFactorEnabled', 'botProtectionEnabled', 'sessionTimeout', 'minPasswordLength'
    ];

    const update = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });

    const settings = await AppSetting.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true }
    );

    res.status(200).json(settings.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetSettings = async (req, res) => {
  try {
    const defaults = {
      platformName: 'Nexus Enterprise',
      platformUrl: 'https://admin.nexus-ent.com',
      defaultLanguage: 'English (US)',
      timezone: '(GMT+05:30) India Standard Time',
      termsOfService: '## Platform Usage Rules\n1. Users must be 18+...\n2. All content must comply with global standards...',
      privacyPolicy: '## Data Privacy\nWe value your data security. This document outlines how we process information...',
      commission: 10,
      transactionFee: 2,
      minPayout: 1000,
      currency: 'INR',
      razorpayConnected: false,
      stripeConnected: false,
      twoFactorEnabled: true,
      botProtectionEnabled: false,
      sessionTimeout: '30 Minutes',
      minPasswordLength: 12,
    };

    const settings = await AppSetting.findOneAndUpdate(
      {},
      { $set: defaults },
      { new: true, upsert: true }
    );

    res.status(200).json(settings.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('sessions');
    if (!user) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const sessions = [...(user.sessions || [])]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((session) => ({
        sessionId: session.sessionId,
        browser: session.browser || 'Unknown Browser',
        os: session.os || 'Unknown OS',
        ipAddress: session.ipAddress || 'Unknown',
        createdAt: session.createdAt,
        isCurrent: session.sessionId === req.sessionId,
      }));

    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.revokeAdminSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId is required' });
    }

    if (sessionId === req.sessionId) {
      return res.status(400).json({ message: 'Current session cannot be revoked from this action' });
    }

    const user = await User.findById(req.user._id).select('sessions');
    if (!user) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const exists = (user.sessions || []).some((session) => session.sessionId === sessionId);
    if (!exists) {
      return res.status(404).json({ message: 'Session not found' });
    }

    user.sessions = (user.sessions || []).filter((session) => session.sessionId !== sessionId);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'Session revoked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.revokeAllOtherAdminSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('sessions');
    if (!user) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const beforeCount = (user.sessions || []).length;
    user.sessions = (user.sessions || []).filter((session) => session.sessionId === req.sessionId);
    const removedCount = beforeCount - user.sessions.length;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'Logged out all other sessions', removedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AppUser.findById(id);
    const activities = [
        { id: 1, type: 'subscription', action: 'Subscribed to creator @marcus_dev', desc: 'Plan: Annual Pro Membership ($199.00/yr)', time: '2 hours ago' },
        { id: 2, type: 'comment', action: 'Posted a comment on "Modern UI Trends 2024"', desc: '“This is exactly the type of minimalist approach...”', time: 'Yesterday, 14:20' },
        { id: 3, type: 'login', action: 'Account login from New Device', desc: 'Chrome / MacOS (192.168.1.1) • Mumbai, India', time: 'Jan 22, 2024' },
        { id: 4, type: 'like', action: 'Liked a post by @design_studio', desc: '', time: 'Jan 21, 2024' },
        { id: 5, type: 'purchase', action: 'Purchased digital asset "Icon Pack Vol. 2"', desc: 'Transaction ID: #TR-990812', time: 'Jan 18, 2024' },
    ];
    res.status(200).json({ user, activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Platform Settings Endpoints ---

exports.getPlatformSettings = async (req, res) => {
  try {
    let settings = await AppSetting.findOne();
    let needsSave = false;

    if (!settings) {
      settings = new AppSetting();
      needsSave = true;
    }

    // Convert to a plain object before checking keys to avoid subdocument key edge cases
    const togglesObj = settings.toObject().toggles || {};

    // Default toggles if missing
    if (Object.keys(togglesObj).length === 0) {
      settings.toggles = {
        livestreaming: true,
        messaging: true,
        tips: true,
        contentLock: false,
        community: true
      };
      settings.markModified('toggles');
      needsSave = true;
    }

    // Default plans if missing or empty
    if (!settings.subscriptionPlans || settings.subscriptionPlans.length === 0) {
      settings.subscriptionPlans = [
        {
          id: 'plan_basic',
          tierName: 'BASIC ACCESS',
          planName: 'Free',
          price: 0,
          frequency: '/forever',
          features: ['Standard Marketplace Listing', '15% Platform Fee', 'Basic Support'],
          isRecommended: false,
        },
        {
          id: 'plan_pro',
          tierName: 'MOST POPULAR',
          planName: 'Pro',
          price: 499,
          frequency: '/month',
          features: ['Priority Search Results', '8% Platform Fee', 'Advanced Analytics'],
          isRecommended: true,
        },
        {
          id: 'plan_enterprise',
          tierName: 'ENTERPRISE SCALE',
          planName: 'Premium',
          price: 'Custom',
          frequency: '',
          features: ['White-label Storefront', '5% Platform Fee', 'Dedicated Manager'],
          isRecommended: false,
        }
      ];
      needsSave = true;
    }

    // Save only when defaults are initialized; avoid overwriting on regular GET calls
    if (needsSave) {
      await settings.save();
    }

    const settingsObj = settings.toObject();
    res.status(200).json({ toggles: settingsObj.toggles, subscriptionPlans: settingsObj.subscriptionPlans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePlatformToggle = async (req, res) => {
  try {
    const { featureId, isEnabled } = req.body;
    let settings = await AppSetting.findOne();
    if (!settings) settings = new AppSetting();

    // Map frontend feature IDs to schema properties
    const map = {
      'feat_livestreaming': 'livestreaming',
      'feat_messaging': 'messaging',
      'feat_tips': 'tips',
      'feat_content_lock': 'contentLock',
      'feat_community': 'community'
    };

    const propName = map[featureId];
    if (!propName) {
      return res.status(400).json({ message: 'Invalid featureId' });
    }

    const normalizedEnabled = isEnabled === true || isEnabled === 'true';
    settings.set(`toggles.${propName}`, normalizedEnabled);
    await settings.save();

    res.status(200).json(settings.toObject().toggles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubscriptionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    let settings = await AppSetting.findOne();
    if (!settings) settings = new AppSetting();
    
    const planIndex = settings.subscriptionPlans.findIndex(p => p.id === id);
    if (planIndex !== -1) {
      settings.subscriptionPlans[planIndex] = { ...settings.subscriptionPlans[planIndex].toObject(), ...updates };
      settings.markModified('subscriptionPlans');
      await settings.save();
      res.status(200).json(settings.subscriptionPlans[planIndex]);
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
