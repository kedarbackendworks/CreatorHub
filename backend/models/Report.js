const mongoose = require('mongoose');

const reportSchema = mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    reason: {
      type: String,
      required: true,
      enum: [
        'spam',
        'hate_speech',
        'misinformation',
        'nudity',
        'harassment',
        'violence',
        'copyright',
        'other'
      ]
    },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending'
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    actionTaken: {
      type: String,
      enum: ['none', 'post_locked', 'creator_banned'],
      default: 'none'
    }
  },
  { timestamps: true }
);

reportSchema.index({ postId: 1 });
reportSchema.index({ creatorId: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ reportedBy: 1, postId: 1 }, { unique: true });

module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);
