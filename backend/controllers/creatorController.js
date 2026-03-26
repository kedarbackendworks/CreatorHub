const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');
const Post = require('../models/Post');
const Creator = require('../models/Creator');

// --- Dashboard ---
const getDashboardData = async (req, res) => {
  try {
    let creator = await Creator.findOne({ userId: 'default_user_1' });
    if (!creator) {
      creator = await Creator.create({ userId: 'default_user_1' });
    }

    const posts = await Post.find({ creatorId: creator._id }).sort({ createdAt: 1 });

    const engagementData = posts.map((p, i) => ({
      name: `Post ${i + 1}`,
      views: p.views || 0,
      likes: p.likes || 0,
      comments: p.comments || 0
    }));

    const totalEarned = creator.earnings.total;
    const thisMonth = creator.earnings.thisMonth;
    const avgEarnedPerPost = posts.length > 0 ? (totalEarned / posts.length).toFixed(2) : 0;

    // Stub revenue data
    const revenueData = [
      { name: 'Jan', subscription: 1200, exclusive: 800 },
      { name: 'Feb', subscription: 1900, exclusive: 1100 },
      { name: 'Mar', subscription: 2400, exclusive: 1500 },
      { name: 'Apr', subscription: 2800, exclusive: 1900 },
      { name: 'May', subscription: 3200, exclusive: 2100 },
      { name: 'Jun', subscription: 4100, exclusive: 2800 },
    ];

    res.json({
      creator,
      stats: { totalEarned, thisMonth, avgEarnedPerPost, postCount: posts.length },
      engagementData,
      revenueData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Posts ---
const upload = multer({ storage: multer.memoryStorage() }).single('file');

const createPost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      let creator = await Creator.findOne({ userId: 'default_user_1' });
      if (!creator) creator = await Creator.create({ userId: 'default_user_1' });

      let mediaUrl = '';
      if (req.file) {
        const streamUpload = (req) => {
          return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              { resource_type: 'auto', folder: 'logoipsum_creator' },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };
        const result = await streamUpload(req);
        mediaUrl = result.secure_url;
      }

      const { title, description, mediaType, isExclusive } = req.body;

      const newPost = await Post.create({
        title,
        description,
        mediaType: mediaType || 'image',
        mediaUrl,
        isExclusive: isExclusive === 'true' || isExclusive === true,
        creatorId: creator._id,
        // random mock analytics
        views: Math.floor(Math.random() * 20000),
        likes: Math.floor(Math.random() * 5001),
        comments: Math.floor(Math.random() * 1000)
      });

      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

const getPosts = async (req, res) => {
  try {
    let creator = await Creator.findOne({ userId: 'default_user_1' });
    if (!creator) return res.json([]);

    const posts = await Post.find({ creatorId: creator._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.json({ message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Social Links ---
const updateSocialLinks = async (req, res) => {
  try {
    let creator = await Creator.findOne({ userId: 'default_user_1' });
    if (!creator) creator = await Creator.create({ userId: 'default_user_1' });

    // Update individual platform link
    const { platform, url } = req.body; // expected: { platform: 'instagram', url: '...' }

    creator.socialLinks = { ...creator.socialLinks, [platform]: url };
    await creator.save();

    res.json(creator.socialLinks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSocialLinks = async (req, res) => {
  try {
    let creator = await Creator.findOne({ userId: 'default_user_1' });
    res.json(creator ? creator.socialLinks : {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInsightsData = async (req, res) => {
  try {
    let creator = await Creator.findOne({ userId: 'default_user_1' });
    if (!creator) creator = await Creator.create({ userId: 'default_user_1' });

    // Mock Audience Stats
    const audienceStats = {
      totalUsers: 200,
      activeUsers: 4000,
      profileVisitsRenown: 1500,
      profileVisitsDirect: 1500
    };

    // Mock Sales Stats
    const salesStats = {
      totalSales: 200,
      conversionRate: '20%'
    };

    // Mock Memberships Stats
    const membershipStats = {
      totalMemberships: 200,
      totalMembershipMembers: 200,
      cancelledMembers: 4000,
      conversionRate: '15%'
    };

    // Revenue chart data
    const revenueChart = [
      { date: '20 March, 2026', title: 'Membership name', free: 30, membership: 10, revenue: 600 },
      { date: '21 March, 2026', title: 'Membership name', free: 35, membership: 12, revenue: 800 },
      { date: '22 March, 2026', title: 'Membership name', free: 40, membership: 15, revenue: 1000 },
    ];

    res.json({
      audienceStats,
      salesStats,
      membershipStats,
      revenueChart
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDashboardData,
  createPost,
  getPosts,
  updatePost,
  deletePost,
  updateSocialLinks,
  getSocialLinks,
  getInsightsData
};
