const Livestream = require('../models/Livestream');
const LiveChatMessage = require('../models/LiveChatMessage');
const Creator = require('../models/Creator');

// @desc    Start a livestream (set status → live)
// @route   PUT /api/livestream/:id/start
// @access  Private (creator)
exports.startStream = async (req, res) => {
  try {
    const stream = await Livestream.findById(req.params.id);
    if (!stream) return res.status(404).json({ error: 'Stream not found' });

    const creator = await Creator.findOne({ userId: req.user._id.toString() });
    if (!creator || stream.creatorId.toString() !== creator._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    stream.status = 'live';
    stream.startedAt = new Date();
    await stream.save();

    res.json(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    End a livestream (set status → ended)
// @route   PUT /api/livestream/:id/end
// @access  Private (creator)
exports.endStream = async (req, res) => {
  try {
    const stream = await Livestream.findById(req.params.id);
    if (!stream) return res.status(404).json({ error: 'Stream not found' });

    const creator = await Creator.findOne({ userId: req.user._id.toString() });
    if (!creator || stream.creatorId.toString() !== creator._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    stream.status = 'ended';
    stream.endedAt = new Date();
    if (stream.startedAt) {
      stream.duration = Math.floor((stream.endedAt - stream.startedAt) / 1000);
    }
    stream.peakViewers = req.body.peakViewers || stream.peakViewers;
    await stream.save();

    res.json(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get a specific livestream by ID (public)
// @route   GET /api/livestream/:id
// @access  Public
exports.getStreamById = async (req, res) => {
  try {
    const stream = await Livestream.findById(req.params.id).populate('creatorId');
    if (!stream) return res.status(404).json({ error: 'Stream not found' });
    res.json(stream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    List all live/scheduled streams (public discovery)
// @route   GET /api/livestream
// @access  Public
exports.getActiveStreams = async (req, res) => {
  try {
    const streams = await Livestream.find({
      status: { $in: ['live', 'scheduled'] },
    })
      .populate('creatorId', 'name avatar username category')
      .sort({ startedAt: -1, scheduledTime: 1 });

    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    List all livestreams for a specific creator
// @route   GET /api/livestream/creator/:creatorId
// @access  Public
exports.getStreamsByCreator = async (req, res) => {
  try {
    const streams = await Livestream.find({
      creatorId: req.params.creatorId,
    })
      .populate('creatorId', 'name avatar username category')
      .sort({ createdAt: -1 });

    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Save a chat message (for persistence)
// @route   POST /api/livestream/:id/chat
// @access  Private
exports.saveChatMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const message = await LiveChatMessage.create({
      streamId: req.params.id,
      userId: req.user._id,
      userName: req.user.name,
      avatar: req.user.avatar || '',
      text: text.trim(),
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get chat history for a stream
// @route   GET /api/livestream/:id/chat
// @access  Public
exports.getChatHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const messages = await LiveChatMessage.find({
      streamId: req.params.id,
      isModerated: false,
    })
      .sort({ createdAt: 1 })
      .limit(limit);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
