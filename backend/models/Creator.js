const mongoose = require('mongoose');

const creatorSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, default: 'default_user_1' },
    name: { type: String, default: 'Alex Morgan' },
    username: { type: String, default: 'alexcreates' },
    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    earnings: {
      total: { type: Number, default: 24892.50 },
      thisMonth: { type: Number, default: 4250.00 },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Creator', creatorSchema);
