const mongoose = require('mongoose');

const liveChatMessageSchema = new mongoose.Schema(
  {
    streamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Livestream',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: { type: String, required: true },
    avatar: { type: String, default: '' },
    text: { type: String, required: true },
    isPinned: { type: Boolean, default: false },
    isModerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LiveChatMessage', liveChatMessageSchema);
