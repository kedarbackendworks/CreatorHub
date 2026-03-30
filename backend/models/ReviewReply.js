const mongoose = require('mongoose');

const reviewReplySchema = new mongoose.Schema({
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentReply: { type: mongoose.Schema.Types.ObjectId, ref: 'ReviewReply', default: null },
  content: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('ReviewReply', reviewReplySchema);