const mongoose = require('mongoose');

const livestreamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  thumbnail: { type: String, default: 'https://via.placeholder.com/600x400' },
  audience: { type: String, enum: ['All members', 'Paid access'], default: 'All members' },
  scheduledTime: { type: Date, default: Date.now },
  status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
  startedAt: { type: Date },
  endedAt: { type: Date },
  duration: { type: Number, default: 0 },
  peakViewers: { type: Number, default: 0 },
  recordingUrl: { type: String, default: '' },
  settings: {
    displayChat: { type: Boolean, default: true },
    notificationsEnabled: { type: Boolean, default: true },
    autoModeration: { type: Boolean, default: true }
  },
  viewerCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Livestream', livestreamSchema);
