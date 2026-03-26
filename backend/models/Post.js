const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    isExclusive: { type: Boolean, default: false },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
    
    // Engagement
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    
    // Earnings breakdown
    revenue: {
      subscription: { type: Number, default: 0 },
      exclusive: { type: Number, default: 0 },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
