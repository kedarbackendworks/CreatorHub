const mongoose = require('mongoose');

const banSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', default: null },
    reason: { type: String, required: true, trim: true },
    banType: { type: String, enum: ['temporary', 'permanent'], required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    liftedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    liftedAt: { type: Date, default: null },
    liftReason: { type: String, default: '' }
  },
  { timestamps: true }
);

banSchema.index({ userId: 1, isActive: 1 });
banSchema.index({ endDate: 1 });

banSchema.statics.getActiveBan = async function (userId) {
  return this.findOne({
    userId,
    isActive: true,
    $or: [{ banType: 'permanent' }, { endDate: { $gt: new Date() } }]
  })
    .sort({ createdAt: -1 })
    .exec();
};

banSchema.statics.expireOldBans = async function () {
  return this.updateMany(
    {
      banType: 'temporary',
      isActive: true,
      endDate: { $ne: null, $lte: new Date() }
    },
    {
      $set: { isActive: false }
    }
  ).exec();
};

module.exports = mongoose.models.Ban || mongoose.model('Ban', banSchema);
