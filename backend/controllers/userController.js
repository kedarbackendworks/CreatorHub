const User = require('../models/User');
const Creator = require('../models/Creator');
const Post = require('../models/Post');
const Reaction = require('../models/Reaction');
const Comment = require('../models/Comment');
const Review = require('../models/Review');
const ReviewReply = require('../models/ReviewReply');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');

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
    res.json(posts);
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

    // Assuming we have a follows array in User model or a separate Follow model
    // For now, let's just send success
    res.json({ message: 'Successfully followed/unfollowed' });
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
      const reaction = await Reaction.findOne({ user: userId, post: post._id });
      if (reaction) {
        userReaction = reaction.type;
      }
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
    res.status(500).json({ error: err.message });
  }
};
