const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    conversationId: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: false, default: '' },
    isRead: { type: Boolean, default: false },
    mediaUrl: { type: String },
    thumbnailUrl: { type: String, default: '' },
    mediaType: { type: String, enum: ['image', 'video', 'file', 'link'] },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    reactions: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        emoji: { type: String }
      }
    ],
    encryptedText: { type: String },
    nonce: { type: String },
    isEncrypted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'seen'],
      default: 'sent'
    },
    replyTo: {
      messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
      text: { type: String },
      senderName: { type: String }
    },
    hiddenFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
