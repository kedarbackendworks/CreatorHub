const { AppUser, AppReport, AppTransaction, AppTicket, AppSetting, AppDashboard } = require('../models/AdminData');

// --- Seeder ---
const seedData = async () => {
  const usersCount = await AppUser.countDocuments();
  if (usersCount === 0) {
    await AppUser.insertMany([
      { name: 'Rahul Sharma', email: 'rahul@email.com', role: 'Premium User', status: 'Active', joined: 'Jan 12, 2026', avatar: 'https://i.pravatar.cc/150?u=1', password: 'password123' },
      { name: 'Priya S', email: 'priya@email.com', role: 'User', status: 'Suspended', joined: 'Feb 2, 2026', avatar: 'https://i.pravatar.cc/150?u=2', password: 'password123' },
      { name: 'Marcus Webb', email: 'm.webb@domain.com', role: 'Admin', status: 'Active', joined: 'Oct 15, 2025', avatar: 'https://i.pravatar.cc/150?u=3', password: 'password123' },
      { name: 'Kevin Larsson', email: 'kevin.l@tech.co', role: 'Creator', status: 'Active', joined: 'Mar 3, 2026', avatar: 'https://i.pravatar.cc/150?u=4', password: 'password123' },
      { name: 'Sarah Jenkins', email: 's.jenkins@mail.com', role: 'User', status: 'Suspended', joined: 'Dec 12, 2025', avatar: 'https://i.pravatar.cc/150?u=5', password: 'password123' },
      { name: 'Michael Smith', email: 'm.smith@email.com', role: 'Admin', status: 'Active', joined: 'Jan 05, 2023', avatar: 'https://i.pravatar.cc/150?u=6', password: 'password123' },
      { name: 'Emily Davis', email: 'e.davis@email.com', role: 'Moderator', status: 'Pending', joined: 'Feb 22, 2023', avatar: 'https://i.pravatar.cc/150?u=7', password: 'password123' },
    ]);

    await AppReport.insertMany([
      { title: 'Workout Video Clip', creator: 'JohnFit', reason: 'SPAM', status: 'Pending', img: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=100&q=80' },
      { title: 'Cooking Tutorial', creator: 'ChefMaria', reason: 'ABUSE', status: 'Reviewed', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=100&q=80' },
      { title: 'New Music Track', creator: 'ArtistXYZ', reason: 'COPYRIGHT', status: 'Pending', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&q=80' },
    ]);

    await AppTransaction.insertMany([
      { txnId: 'TXN12345', user: 'Rahul', initial: 'R', amount: '₹499', status: 'Completed', date: 'Oct 24, 2023' },
      { txnId: 'TXN12346', user: 'Anjali', initial: 'A', amount: '₹1,299', status: 'Pending', date: 'Oct 24, 2023' },
      { txnId: 'TXN12347', user: 'Vikram', initial: 'V', amount: '₹850', status: 'Completed', date: 'Oct 23, 2023' },
      { txnId: 'TXN12348', user: 'Sanya', initial: 'S', amount: '₹2,100', status: 'Failed', date: 'Oct 23, 2023' },
      { txnId: 'TXN12349', user: 'Arjun', initial: 'A', amount: '₹550', status: 'Completed', date: 'Oct 22, 2023' },
    ]);

    await AppTicket.insertMany([
      { ticketId: '#10234', user: 'Alex Rivera', issue: 'Payment', desc: 'Payout delayed for 4...', priority: 'High', assigned: 'Sarah Jenkins', updated: '2 mins ago' },
      { ticketId: '#10235', user: 'Jordan Smith', issue: 'Account', desc: 'Unable to change pas...', priority: 'Low', assigned: 'Unassigned', updated: '1 hour ago' },
      { ticketId: '#10236', user: 'Mila Kunis', issue: 'Content', desc: 'Copyright claim dispu...', priority: 'Medium', assigned: 'Dave Miller', updated: '4 hours ago' },
    ]);

    await AppSetting.create({
      platformName: 'Creator Marketplace', commission: 10, transactionFee: 15, minPayout: 1000, currency: 'INR',
      toggles: { livestream: true, courses: true, tips: true, dm: false, forums: false, AI: true, ageRes: false }
    });

    await AppDashboard.create({
      users: { count: '24,580', growth: '+5%', data: [{ name: 'Jan', val: 10 }, { name: 'Feb', val: 70 }, { name: 'Mar', val: 90 }, { name: 'Apr', val: 0 }, { name: 'May', val: 20 }] },
      creators: { count: '3,120', growth: '+5%', data: [{ name: 'Jan', val: 10 }, { name: 'Feb', val: 70 }, { name: 'Mar', val: 90 }, { name: 'Apr', val: 0 }, { name: 'May', val: 20 }] },
      revenue: { count: '₹12,40,000', growth: '+5%', data: [{ name: 'Jan', val: 10 }, { name: 'Feb', val: 70 }, { name: 'Mar', val: 90 }, { name: 'Apr', val: 0 }, { name: 'May', val: 20 }] },
      subscriptions: { count: '8,450', growth: '-5%', data: [{ name: 'Jan', val: 10 }, { name: 'Feb', val: 70 }, { name: 'Mar', val: 90 }, { name: 'Apr', val: 0 }, { name: 'May', val: 20 }] },
      revenueOverTime: [{ name: 'Jan', val: 10 }, { name: 'Feb', val: 70 }, { name: 'Mar', val: 85 }, { name: 'Apr', val: 0 }, { name: 'May', val: 20 }, { name: 'Jun', val: 40 }, { name: 'Jul', val: 95 }, { name: 'Aug', val: 50 }, { name: 'Sep', val: 60 }, { name: 'Oct', val: 60 }, { name: 'Nov', val: 30 }, { name: 'Dec', val: 80 }],
      userGrowth: [{ name: 'Jan', val: 10 }, { name: 'Feb', val: 70 }, { name: 'Mar', val: 90 }, { name: 'Apr', val: 0 }, { name: 'May', val: 20 }, { name: 'Jun', val: 40 }, { name: 'Jul', val: 100 }, { name: 'Aug', val: 50 }, { name: 'Sep', val: 60 }, { name: 'Oct', val: 60 }, { name: 'Nov', val: 30 }, { name: 'Dec', val: 80 }],
      payoutsData: [{ name: 'Jan', val: 10 }, { name: 'Feb', val: 70 }, { name: 'Mar', val: 90 }, { name: 'Apr', val: 0 }, { name: 'May', val: 20 }, { name: 'Jun', val: 60 }]
    });

    console.log("Admin Data Seeded Succesfully");
  }
};

// Expose Controllers
exports.getAllData = async (req, res) => {
  try {
    await seedData();
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

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AppUser.findById(id);
    // Mocking an activity log specific to user
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
