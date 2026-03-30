const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    mediaUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    mediaType: { type: String, enum: ['image', 'video', 'link', 'file', 'livestream'], required: true },
    isExclusive: { type: Boolean, default: false },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
    status: { type: String, enum: ['draft', 'published', 'scheduled', 'archived'], default: 'published' },
    category: { type: String, enum: ['content', 'insight', 'payout', 'other'], default: 'content' },
    price: { type: Number, default: 0 },
    
    // Engagement
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    
    // Earnings breakdown
    revenue: {
      total: { type: Number, default: 0 },
      breakdown: {
         subscriptionPay: { type: Number, default: 0 },
         directPurchase: { type: Number, default: 0 }
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
