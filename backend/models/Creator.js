const mongoose = require('mongoose');

const creatorSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, default: 'default_user_1' },
    name: { type: String, default: 'Alex Morgan' },
    username: { type: String, default: 'alexcreates' },
    avatar: { type: String, default: 'https://i.pravatar.cc/150' },
    banner: { type: String, default: '/assets/creator/banner.png' },
    bio: { type: String, default: 'Digital Artist and Photographer. Welcome to my exclusive content area.' },
    category: { type: String, default: 'Art and Design' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    earnings: {
      total: { type: Number, default: 24892.50 },
      thisMonth: { type: Number, default: 4250.00 },
    },
    subscriptionPrice: { type: Number, default: 4.99 },
    payoutSettings: {
      kyc: { 
        status: { type: String, enum: ['unverified', 'pending', 'verified'], default: 'unverified' },
        pan: { type: String, default: '' },
        aadhaar: { type: String, default: '' },
        updatedAt: { type: Date }
      },
      billing: {
        status: { type: String, enum: ['unverified', 'verified'], default: 'unverified' },
        address: { type: String, default: '' },
        taxId: { type: String, default: '' },
        updatedAt: { type: Date }
      },
      bank: {
        status: { type: String, enum: ['unverified', 'verified'], default: 'unverified' },
        accountNumber: { type: String, default: '' },
        ifsc: { type: String, default: '' },
        bankName: { type: String, default: '' },
        updatedAt: { type: Date }
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Creator', creatorSchema);
