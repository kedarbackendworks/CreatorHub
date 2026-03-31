const User = require('../models/User');
const Creator = require('../models/Creator');
const Post = require('../models/Post');
const Reaction = require('../models/Reaction');
const Comment = require('../models/Comment');
const Review = require('../models/Review');
const ReviewReply = require('../models/ReviewReply');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary');

const profileUpload = multer({ storage: multer.memoryStorage() }).single('avatar');

// @desc    Get notifications for logged-in user
// @route   GET /api/user/notifications
// @access  Private
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Mark one user notification as read
// @route   PUT /api/user/notifications/:id/read
// @access  Private
exports.markUserNotificationRead = async (req, res) => {
  try {
    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/user/notifications/mark-all-read
// @access  Private
exports.markAllUserNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update logged-in user profile
// @route   PUT /api/user/update-profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  profileUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const updates = {};

      if (typeof req.body.name === 'string' && req.body.name.trim()) {
        updates.name = req.body.name.trim();
      }

      if (typeof req.body.countryOfResidence === 'string' && req.body.countryOfResidence.trim()) {
        updates.countryOfResidence = req.body.countryOfResidence.trim();
      }

      if (req.file) {
        const uploadToCloudinary = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { resource_type: 'auto', folder: 'logoipsum_avatars' },
              (uploadError, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(uploadError);
                }
              }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });

        const uploadResult = await uploadToCloudinary();
        updates.avatar = uploadResult.secure_url;
      }

      let user;

      if (Object.keys(updates).length === 0) {
        user = await User.findById(req.user._id).select('_id name email role avatar countryOfResidence');
      } else {
        user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true })
          .select('_id name email role avatar countryOfResidence');
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

// @desc    Get all creators for discovery
// @route   GET /api/user/creators
exports.getCreators = async (req, res) => {
  try {
    const creators = await Creator.find({ status: 'active' }).sort({ createdAt: -1 });
    
    // Attach recent posts to each creator
    const creatorsWithPosts = await Promise.all(creators.map(async (creator) => {
      const posts = await Post.find({ creatorId: creator._id, status: 'published' })
        .sort({ createdAt: -1 })
        .limit(6);
      return {
        ...creator._doc,
        posts
      };
    }));

    res.json(creatorsWithPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get specific creator profile
// @route   GET /api/user/creators/:id
exports.getCreatorProfile = async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);
    if (!creator) return res.status(404).json({ message: 'Creator not found' });
    res.json(creator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get posts for a creator (only public unless follower/subscriber)
// @route   GET /api/user/creators/:id/posts
exports.getCreatorPosts = async (req, res) => {
  try {
    const posts = await Post.find({ creatorId: req.params.id, status: 'published' }).sort({ createdAt: -1 });

    let userId = null;

    if (req.user) {
      userId = req.user._id;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        userId = decoded.id;
      } catch (error) {
        userId = null;
      }
    }

    const enrichedPosts = posts.map((post) => ({
      ...post.toObject(),
      userReaction: null,
      likes: post.likes || 0,
      dislikes: post.dislikes || 0,
      comments: post.comments || 0,
    }));

    if (!userId || posts.length === 0) {
      return res.json(enrichedPosts);
    }

    const reactions = await Reaction.find({
      user: userId,
      post: { $in: posts.map((post) => post._id) },
    }).select('post type');

    const reactionByPost = new Map(
      reactions.map((reaction) => [reaction.post.toString(), reaction.type])
    );

    res.json(
      enrichedPosts.map((post) => ({
        ...post,
        userReaction: reactionByPost.get(post._id.toString()) || null,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Toggle follow creator
// @route   POST /api/user/follow/:creatorId
exports.toggleFollowCreator = async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.creatorId);
    if (!creator) return res.status(404).json({ message: 'Creator not found' });

    const currentUserId = req.user._id.toString();
    const isFollowing = creator.followers.some((followerId) => followerId.toString() === currentUserId);

    if (isFollowing) {
      creator.followers = creator.followers.filter((followerId) => followerId.toString() !== currentUserId);
      await creator.save();
      return res.json({ message: 'Successfully unfollowed', isFollowing: false });
    }

    creator.followers.push(req.user._id);
    await creator.save();

    try {
      if (creator.userId && creator.userId !== currentUserId) {
        await Notification.create({
          recipient: creator.userId,
          sender: req.user._id,
          type: 'subscription',
          content: `${req.user.name} started following you`
        });
      }
    } catch (notiErr) {
      console.error('Notification error:', notiErr);
    }

    return res.json({ message: 'Successfully followed', isFollowing: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Livestream = require('../models/Livestream');

// @desc    Get all active/scheduled livestreams for discovery
// @route   GET /api/user/livestreams
exports.getLiveStreams = async (req, res) => {
  try {
    const streams = await Livestream.find({ status: 'live' }).populate('creatorId');
    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get detailed post information
// @route   GET /api/user/posts/:id
exports.getPostDetails = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('creatorId');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    let userReaction = null;
    let userId = null;

    // Check if user is authenticated (can be guest)
    if (req.user) {
      userId = req.user._id;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        userId = decoded.id;
      } catch (e) {
        // Token invalid, ignore
      }
    }

    if (userId) {
      // Increment views and track unique viewers
      await Post.findByIdAndUpdate(req.params.id, {
        $inc: { views: 1 },
        $addToSet: { uniqueViewers: userId }
      });

      const reaction = await Reaction.findOne({ user: userId, post: post._id });
      if (reaction) {
        userReaction = reaction.type;
      }
    } else {
      // For guests, still increment total views but cannot track unique viewer by ID
      await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    }

    res.json({
      ...post.toObject(),
      userReaction,
      likes: post.likes || 0,
      dislikes: post.dislikes || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get creators followed by the user
// @route   GET /api/user/following
exports.getFollowingCreators = async (req, res) => {
  try {
    // Dummy response for now (replace with real logic later)
    res.json({ message: "Following creators list" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Search creators
// @route   GET /api/user/creators/search
exports.searchCreators = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.json([]);
    const creators = await Creator.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(creators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    React to a post
// @route   POST /api/user/posts/:id/react
exports.reactToPost = async (req, res) => {
  try {
    const { type } = req.body; // 'like' or 'dislike'
    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const existingReaction = await Reaction.findOne({ user: req.user._id, post: post._id });

    if (!existingReaction) {
      // Create new reaction
      await Reaction.create({ user: req.user._id, post: post._id, type });
      if (type === 'like') {
        post.likes += 1;
      } else {
        post.dislikes = (post.dislikes || 0) + 1;
      }
      await post.save();
      
      // Create notification for the creator
      try {
        const postCreator = await Creator.findById(post.creatorId);
        if (postCreator && postCreator.userId !== req.user._id.toString()) {
          await Notification.create({
            recipient: postCreator.userId,
            sender: req.user._id,
            type: 'like',
            content: `${req.user.name} liked your post: ${post.title}`,
            relatedId: post._id
          });
        }
      } catch (notiErr) {
        console.error("Notification error:", notiErr);
      }

      return res.json({ likes: post.likes, dislikes: post.dislikes, userReaction: type });
    }

    if (existingReaction.type === type) {
      // Toggle off
      await Reaction.findByIdAndDelete(existingReaction._id);
      if (type === 'like') {
        post.likes = Math.max(0, post.likes - 1);
      } else {
        post.dislikes = Math.max(0, (post.dislikes || 0) - 1);
      }
      await post.save();
      return res.json({ likes: post.likes, dislikes: post.dislikes, userReaction: null });
    }

    // Switch type
    await Reaction.findByIdAndUpdate(existingReaction._id, { type });
    if (type === 'like') {
      post.likes += 1;
      post.dislikes = Math.max(0, (post.dislikes || 0) - 1);
    } else {
      post.dislikes = (post.dislikes || 0) + 1;
      post.likes = Math.max(0, post.likes - 1);
    }
    await post.save();
    return res.json({ likes: post.likes, dislikes: post.dislikes, userReaction: type });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get comments for a post
// @route   GET /api/user/posts/:id/comments
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/user/posts/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { content, parentCommentId } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = await Comment.create({
      user: req.user._id,
      post: post._id,
      parentComment: parentCommentId || null,
      content: content.trim()
    });

    post.comments = (post.comments || 0) + 1;
    await post.save();

    // Create notification for the creator or parent commenter
    try {
      const postCreator = await Creator.findById(post.creatorId);
      
      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId).populate('user');
        if (parentComment && parentComment.user._id.toString() !== req.user._id.toString()) {
           await Notification.create({
              recipient: parentComment.user._id,
              sender: req.user._id,
              type: 'comment',
              content: `${req.user.name} replied to your comment on "${post.title}"`,
              relatedId: post._id
           });
        }
      } else if (postCreator && postCreator.userId !== req.user._id.toString()) {
        await Notification.create({
          recipient: postCreator.userId,
          sender: req.user._id,
          type: 'comment',
          content: `${req.user.name} commented on your post: ${post.title}`,
          relatedId: post._id
        });
      }
    } catch (notiErr) {
      console.error("Notification error:", notiErr);
    }

    const populatedComment = await Comment.findById(newComment._id).populate('user', 'name avatar');
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update a user comment
// @route   PUT /api/user/comments/:commentId
// @access  Private
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own comments' });
    }

    comment.content = content.trim();
    await comment.save();

    const populatedComment = await Comment.findById(comment._id).populate('user', 'name avatar');
    res.json(populatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete a user comment
// @route   DELETE /api/user/comments/:commentId
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    const idsToDelete = [comment._id];
    let parentIds = [comment._id];

    while (parentIds.length > 0) {
      const childComments = await Comment.find({ parentComment: { $in: parentIds } }).select('_id');

      if (childComments.length === 0) {
        break;
      }

      const childIds = childComments.map((child) => child._id);
      idsToDelete.push(...childIds);
      parentIds = childIds;
    }

    const deleteResult = await Comment.deleteMany({ _id: { $in: idsToDelete } });
    const deletedCount = deleteResult.deletedCount || 0;

    const post = await Post.findById(comment.post);
    if (post && deletedCount > 0) {
      post.comments = Math.max(0, (post.comments || 0) - deletedCount);
      await post.save();
    }

    res.json({ message: 'Comment deleted', deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get reviews for a creator
// @route   GET /api/user/creators/:id/reviews
exports.getCreatorReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Review.countDocuments({ creator: req.params.id });
    
    const reviews = await Review.find({ creator: req.params.id })
      .populate('user', 'name avatar') // user might not have avatar in schema but we try
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      reviews,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Add a review to a creator
// @route   POST /api/user/creators/:id/reviews
exports.addCreatorReview = async (req, res) => {
  try {
    const { content, rating } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Review content is required' });
    }

    const creatorId = req.params.id;

    // Check for existing review
    const existingReview = await Review.findOne({ user: req.user._id, creator: creatorId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this creator' });
    }

    const newReview = await Review.create({
      user: req.user._id,
      creator: creatorId,
      content: content.trim(),
      rating
    });

    const populatedReview = await Review.findById(newReview._id).populate('user', 'name avatar');
    res.status(201).json(populatedReview);

  } catch (err) {
    // Handle mongoose unique index error separately if it slips through
    if (err.code === 11000) {
        return res.status(400).json({ message: 'You have already reviewed this creator' });
    }
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get replies for a review
// @route   GET /api/user/reviews/:id/replies
exports.getReviewReplies = async (req, res) => {
  try {
    const replies = await ReviewReply.find({ review: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(replies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Add a reply to a review
// @route   POST /api/user/reviews/:id/replies
exports.addReviewReply = async (req, res) => {
  try {
    const { content, parentReplyId } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Reply content is required' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const newReply = await ReviewReply.create({
      user: req.user._id,
      review: review._id,
      parentReply: parentReplyId || null,
      content: content.trim()
    });

    const populatedReply = await ReviewReply.findById(newReply._id).populate('user', 'name avatar');
    res.status(201).json(populatedReply);
  } catch (err) {
    console.error("Error adding review reply:", err);
    res.status(500).json({ error: err.message });
  }
};
