const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
  content: { type: String, required: true, trim: true },
  rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

// A user can only leave one review per creator
reviewSchema.index({ user: 1, creator: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);