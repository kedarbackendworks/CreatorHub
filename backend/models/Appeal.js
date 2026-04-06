const mongoose = require('mongoose');

const appealSchema = mongoose.Schema(
  {
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    banId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ban', default: null },
    appealType: { type: String, enum: ['ban', 'post_lock'], default: 'ban' },
    postIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    reason: { type: String, required: true, trim: true, minlength: 50, maxlength: 2000 },
    supportingInfo: { type: String, trim: true, default: '' },
    attachments: {
      type: [
        {
          url: { type: String, default: '' },
          type: { type: String, enum: ['image', 'video', 'file'], default: 'file' },
          filename: { type: String, default: '' },
          sizeBytes: { type: Number, default: 0 }
        }
      ],
      default: []
    },
    supportTicketId: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedAt: { type: Date, default: Date.now },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    adminNote: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

appealSchema.index({ creatorId: 1 });
appealSchema.index({ creatorId: 1, appealType: 1, status: 1 });
appealSchema.index({ banId: 1 }, { unique: true, sparse: true });
appealSchema.index({ status: 1 });

module.exports = mongoose.models.Appeal || mongoose.model('Appeal', appealSchema);
