const mongoose = require('mongoose');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');
const Post = require('../models/Post');
const Creator = require('../models/Creator');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Livestream = require('../models/Livestream');

// --- Dashboard ---
const getDashboardData = async (req, res) => {
  try {
    let creator = await Creator.findOne({ userId: req.user._id.toString() });
    if (!creator) {
      creator = await Creator.create({ 
          userId: req.user._id.toString(), 
          name: req.user.name, 
          username: req.user.name.toLowerCase().replace(' ', '') 
      });
    }

    const posts = await Post.find({ creatorId: creator._id });
    const activeSubscribers = creator.subscribers ? creator.subscribers.length : 0;
    
    // Sum real earnings from posts
    const calculatedTotalEarned = posts.reduce((sum, p) => sum + (p.revenue?.total || 0), 0);
    const totalEarned = Math.max(creator.earnings.total, calculatedTotalEarned);
    const thisMonth = creator.earnings.thisMonth;

    // Per-post performance/revenue table
    const postRevenueBreakdown = posts.map(p => ({
      id: p._id,
      title: p.title,
      type: p.mediaType,
      date: p.createdAt,
      revenueSubscription: p.revenue?.breakdown?.subscriptionPay || 0,
      revenueExclusive: p.revenue?.breakdown?.directPurchase || 0,
      total: p.revenue?.total || 0,
      views: p.views || 0,
      likes: p.likes || 0,
      comments: p.comments || 0,
      thumbnailUrl: p.thumbnailUrl || (p.mediaType === 'image' ? p.mediaUrl : ''),
      mediaUrl: p.mediaUrl
    })).sort((a,b) => b.date - a.date).slice(0, 10);

    // Month breakdown (real-ish, normally you'd use aggregation)
    const revenueHistory = [
      { name: 'Total', subscription: posts.reduce((sum, p) => sum + (p.revenue?.breakdown?.subscriptionPay || 0), 0), exclusive: posts.reduce((sum, p) => sum + (p.revenue?.breakdown?.directPurchase || 0), 0) },
    ];

    res.json({
      creator,
      stats: {
        totalEarned,
        thisMonth,
        activeSubscribers,
        postCount: posts.length
      },
      postRevenueBreakdown,
      revenueHistory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCreatorProfile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      let creator = await Creator.findOne({ userId: req.user._id.toString() });
      if (!creator) return res.status(404).json({ error: 'Creator not found' });

      const { name, username, bio } = req.body;

      if (name) creator.name = name;
      if (username) creator.username = username.toLowerCase().replace(' ', '');
      if (bio !== undefined) creator.bio = bio;

      if (req.file) {
        const streamUpload = (req) => {
          return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              { resource_type: 'auto', folder: 'logoipsum_avatars' },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };
        const result = await streamUpload(req);
        creator.avatar = result.secure_url;
      } else if (req.body.avatar) {
        creator.avatar = req.body.avatar;
      }

      await creator.save();
      
      // Also update name in User model if changed
      if (name) {
        await User.findByIdAndUpdate(req.user._id, { name });
      }

      res.json(creator);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// --- Engagement Analytics ---
const getAnalytics = async (req, res) => {
  try {
    const { timeRange } = req.query; // e.g. '7d', '30d', 'all'
    const creator = await Creator.findOne({ userId: req.user._id.toString() });
    if (!creator) return res.status(404).json({ error: 'Creator profile not found' });

    // In a real app, you'd filter posts by createdAt based on timeRange
    const posts = await Post.find({ creatorId: creator._id }).sort({ createdAt: 1 });

    const engagementChart = posts.map(p => ({
      name: p.title.length > 10 ? p.title.substring(0, 7) + '...' : p.title,
      views: p.views || 0,
      likes: p.likes || 0,
      comments: p.comments || 0,
      date: p.createdAt
    }));

    res.json({ engagementChart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Posts ---
const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

const createPost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      let creator = await Creator.findOne({ userId: req.user._id.toString() });
      if (!creator) creator = await Creator.create({ 
          userId: req.user._id.toString(), 
          name: req.user.name, 
          username: req.user.name.toLowerCase().replace(' ', '') 
      });

      let mediaUrl = '';
      let thumbnailUrl = '';

      const processUpload = async (file, folder) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };

      if (req.files && req.files.file) {
        const result = await processUpload(req.files.file[0], 'logoipsum_creator');
        mediaUrl = result.secure_url;
      } else if (req.body.mediaUrl) {
        mediaUrl = req.body.mediaUrl;
      }

      if (req.files && req.files.thumbnail) {
        const result = await processUpload(req.files.thumbnail[0], 'logoipsum_thumbnails');
        thumbnailUrl = result.secure_url;
      } else if (req.body.thumbnailUrl) {
        thumbnailUrl = req.body.thumbnailUrl;
      }

      const { title, description, mediaType, isExclusive, status, category, price } = req.body;
      
      const realMediaType = mediaType || (req.files?.file?.[0]?.mimetype?.startsWith('video/') ? 'video' : 'image');

      // If video and no thumbnail provided, generate one from cloudinary url
      if (realMediaType === 'video' && !thumbnailUrl && mediaUrl.includes('cloudinary')) {
        thumbnailUrl = mediaUrl.replace(/\.[^/.]+$/, ".jpg");
      }

      const newPost = await Post.create({
        title: title || 'Untitled Post',
        description: description || '',
        mediaType: realMediaType,
        mediaUrl: mediaUrl || 'https://via.placeholder.com/600',
        thumbnailUrl: thumbnailUrl || (realMediaType === 'image' ? mediaUrl : 'https://via.placeholder.com/600'),
        isExclusive: isExclusive === 'true' || isExclusive === true,
        status: status || 'published',
        category: category || 'content',
        price: parseFloat(price || 0),
        creatorId: creator._id,
        views: 0,
        likes: 0,
        comments: 0
      });

      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

const updatePost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    
    try {
        const { id } = req.params;
        let post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        const creator = await Creator.findOne({ userId: req.user._id.toString() });
        if (!creator || post.creatorId.toString() !== creator._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this post' });
        }

        const updateData = { ...req.body };
        
        // Sanitize data
        if (updateData.isExclusive !== undefined) {
          updateData.isExclusive = updateData.isExclusive === 'true' || updateData.isExclusive === true;
        }
        if (updateData.price !== undefined) {
          updateData.price = parseFloat(updateData.price || 0);
        }

        const processUpload = async (file, folder) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'auto', folder },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        };

        if (req.files && req.files.file) {
            const result = await processUpload(req.files.file[0], 'logoipsum_creator');
            updateData.mediaUrl = result.secure_url;
            if (req.files.file[0].mimetype.startsWith('video/')) updateData.mediaType = 'video';
            else if (req.files.file[0].mimetype.startsWith('image/')) updateData.mediaType = 'image';
        }

        if (req.files && req.files.thumbnail) {
            const result = await processUpload(req.files.thumbnail[0], 'logoipsum_thumbnails');
            updateData.thumbnailUrl = result.secure_url;
        }

        // Auto-generate thumbnail for video if not provided/changed
        const currentMediaType = updateData.mediaType || post.mediaType;
        const currentMediaUrl = updateData.mediaUrl || post.mediaUrl;
        const currentThumbnailUrl = updateData.thumbnailUrl || post.thumbnailUrl;

        if (currentMediaType === 'video' && !currentThumbnailUrl && currentMediaUrl?.includes('cloudinary')) {
            updateData.thumbnailUrl = currentMediaUrl.replace(/\.[^/.]+$/, ".jpg");
        }

        const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedPost);
    } catch (err) {
        console.error("Update post error:", err);
        res.status(500).json({ error: err.message });
    }
  });
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Post ID' });
    }
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    // Ensure the post belongs to the authenticated creator
    const creator = await Creator.findOne({ userId: req.user._id.toString() });
    if (!creator || post.creatorId.toString() !== creator._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this post' });
    }
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPosts = async (req, res) => {
  try {
    let creator = await Creator.findOne({ userId: req.user._id.toString() });
    if (!creator) return res.json([]);

    const posts = await Post.find({ creatorId: creator._id }).sort({ createdAt: -1 });
    res.json(posts);
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
    let creator = await Creator.findOne({ userId: req.user._id.toString() });
    if (!creator) creator = await Creator.create({ 
        userId: req.user._id.toString(), 
        name: req.user.name, 
        username: req.user.name.toLowerCase().replace(' ', '') 
    });

    const { platform, url, links } = req.body;
    
    // Bulk update
    if (links) {
        Object.keys(links).forEach(p => {
            if (creator.socialLinks.hasOwnProperty(p)) {
                creator.socialLinks[p] = links[p];
            }
        });
    } 
    // Single platform update
    else if (platform && url !== undefined) {
        if (creator.socialLinks.hasOwnProperty(platform)) {
            creator.socialLinks[platform] = url;
        }
    }

    await creator.save();
    res.json(creator.socialLinks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSocialLinks = async (req, res) => {
  try {
    let creator = await Creator.findOne({ userId: req.user._id.toString() });
    res.json(creator ? creator.socialLinks : {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Subscribers ---
const getSubscribers = async (req, res) => {
    try {
        let creator = await Creator.findOne({ userId: req.user._id.toString() }).populate('subscribers', 'name email createdAt');
        if (!creator) return res.json([]);

        // Subscribers are now directly part of the Creator object
        res.json(creator.subscribers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getInsightsData = async (req, res) => {
  try {
    let creator = await Creator.findOne({ userId: req.user._id.toString() });
    if (!creator) return res.status(404).json({ error: 'Creator not found' });

    const posts = await Post.find({ creatorId: creator._id });
    
    // Aggregating real data
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalComments = posts.reduce((sum, p) => sum + (p.comments || 0), 0);

    const audienceStats = {
      totalUsers: creator.followers?.length || 0,
      activeUsers: creator.subscribers?.length || 0,
      profileVisitsRenown: Math.floor(totalViews * 0.4), // Simulated split
      profileVisitsDirect: Math.floor(totalViews * 0.6)
    };

    const salesStats = {
      totalSales: posts.reduce((sum, p) => sum + (p.revenue?.total || 0), 0),
      conversionRate: audienceStats.totalUsers > 0 ? ((audienceStats.activeUsers / audienceStats.totalUsers) * 100).toFixed(1) + '%' : '0%'
    };

    const membershipStats = {
      totalMemberships: 1, // Currently only one type or tier implied
      totalMembershipMembers: creator.subscribers?.length || 0,
      cancelledMembers: 0,
      conversionRate: audienceStats.totalUsers > 0 ? ((creator.subscribers.length / creator.followers.length) * 100).toFixed(1) + '%' : '0%'
    };

    // Revenue chart data from recent posts or earnings
    const revenueChart = posts.slice(0, 7).map(p => ({
      date: new Date(p.createdAt).toLocaleDateString(),
      title: p.title,
      free: 0, 
      membership: creator.subscribers.length, 
      revenue: p.revenue?.total || 0
    }));

    res.json({
      subscribers: creator.subscribers || [],
      audienceStats,
      salesStats,
      membershipStats,
      revenueChart,
      engagement: {
          totalLikes,
          totalViews,
          totalComments
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Notifications ---
const getNotifications = async (req, res) => {
    try {
        let notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
        
        // Seed if no actual notifications exist for demo
        if (notifications.length === 0) {
            await Notification.create([
                { recipient: req.user._id, type: 'post', content: 'You successfully published a new video post.', createdAt: new Date() },
                { recipient: req.user._id, type: 'subscription', content: 'Jane Doe joined your Premium tier.', createdAt: new Date(Date.now() - 3600000) },
                { recipient: req.user._id, type: 'like', content: 'Your latest photo post got 50 new likes.', createdAt: new Date(Date.now() - 86400000) },
                { recipient: req.user._id, type: 'payout', content: 'Your payout of $1500 has been processed.', createdAt: new Date(Date.now() - 172800000) }
            ]);
            notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
        }
        
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { isRead: true });
        res.json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Payouts ---
const getPayoutSettings = async (req, res) => {
    try {
        let creator = await Creator.findOne({ userId: req.user._id.toString() });
        if (!creator) return res.status(404).json({ error: 'Creator profile not found' });
        res.json(creator.payoutSettings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updatePayoutSettings = async (req, res) => {
    try {
        let creator = await Creator.findOne({ userId: req.user._id.toString() });
        if (!creator) return res.status(404).json({ error: 'Creator not found' });

        const { type, data } = req.body; // type: 'kyc', 'billing', 'bank'
        if (creator.payoutSettings[type]) {
            Object.assign(creator.payoutSettings[type], data);
            creator.payoutSettings[type].updatedAt = new Date();
            // If they provided details, set status to pending or verified for demo
            if (type === 'kyc') creator.payoutSettings[type].status = 'pending';
            else creator.payoutSettings[type].status = 'verified';
        }

        await creator.save();
        res.json(creator.payoutSettings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Livestreams ---
const createLivestream = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });
        try {
            let creator = await Creator.findOne({ userId: req.user._id.toString() });
            if (!creator) return res.status(404).json({ error: 'Creator profile missing' });

            const { title, description, audience, scheduledTime, settings } = req.body;
            let thumbnail = '';

            if (req.file) {
                const streamUpload = (req) => {
                    return new Promise((resolve, reject) => {
                        let stream = cloudinary.uploader.upload_stream(
                            { resource_type: 'auto', folder: 'logoipsum_livestreams' },
                            (error, result) => {
                                if (result) resolve(result);
                                else reject(error);
                            }
                        );
                        streamifier.createReadStream(req.file.buffer).pipe(stream);
                    });
                };
                const result = await streamUpload(req);
                thumbnail = result.secure_url;
            }

            const newLive = await Livestream.create({
                title,
                description,
                thumbnail: thumbnail || 'https://via.placeholder.com/600x400',
                audience,
                scheduledTime,
                creatorId: creator._id,
                settings: settings ? JSON.parse(settings) : { displayChat: true, notificationsEnabled: true, autoModeration: true }
            });

            res.status(201).json(newLive);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
};

const getLivestreams = async (req, res) => {
    try {
        let creator = await Creator.findOne({ userId: req.user._id.toString() });
        if (!creator) return res.json([]);
        const livestreams = await Livestream.find({ creatorId: creator._id }).sort({ scheduledTime: 1 });
        res.json(livestreams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const Message = require('../models/Message');

const getMessages = async (req, res) => {
    try {
        // Get all unique conversations for this user (both sender or recipient)
        const messages = await Message.find({ 
            $or: [{ sender: req.user._id }, { recipient: req.user._id }] 
        }).sort({ createdAt: -1 }).populate('sender recipient', 'name email avatar');
        
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { recipientId, text, mediaUrl, mediaType } = req.body;
        const message = await Message.create({
            conversationId: [req.user._id, recipientId].sort().join('_'),
            sender: req.user._id,
            recipient: recipientId,
            text,
            mediaUrl,
            mediaType
        });

        // Create a notification for the recipient
        await Notification.create({
            recipient: recipientId,
            sender: req.user._id,
            type: 'message',
            content: `You received a new message from ${req.user.name}`,
            relatedId: message._id
        });

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
  getDashboardData,
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  updateSocialLinks,
  getSocialLinks,
  getAnalytics,
  getSubscribers,
  getInsightsData,
  updateCreatorProfile,
  getNotifications,
  markNotificationRead,
  getPayoutSettings,
  updatePayoutSettings,
  createLivestream,
  getLivestreams,
  getMessages,
  sendMessage
};
