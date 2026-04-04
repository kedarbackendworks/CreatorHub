const mongoose = require('../../Moderation/models/_mongoose');
const { TICKET_STATUSES, PRIORITY_LEVELS, ISSUE_TYPES } = require('../utils/ticketConstants');

const counterSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
  },
  { collection: 'support_ticket_counters' }
);

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', default: null },
    sourceType: {
      type: String,
      enum: ['user_report', 'user_submitted'],
      default: 'user_report',
      index: true,
    },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    submitterRole: { type: String, enum: ['user', 'creator', null], default: null },
    tag: { type: String, enum: ['finance', 'support', 'moderation', 'other'], default: null },
    heading: { type: String, maxlength: 120, default: '' },
    description: { type: String, maxlength: 2000, default: '' },
    attachments: {
      type: [
        {
          url: { type: String, default: '' },
          type: { type: String, enum: ['image', 'video'], required: true },
          filename: { type: String, default: '' },
          sizeBytes: { type: Number, default: 0 },
        },
      ],
      default: [],
      validate: {
        validator: (value) => Array.isArray(value) && value.length <= 5,
        message: 'A maximum of 5 attachments is allowed.',
      },
    },
    adminResponse: { type: String, default: null },
    respondedAt: { type: Date, default: null },
    status: { type: String, enum: TICKET_STATUSES, default: 'open', index: true },
    priority: { type: String, enum: PRIORITY_LEVELS, required: true, index: true },
    issueType: { type: String, enum: ISSUE_TYPES, required: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    assignedAt: { type: Date, default: null },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    resolvedAt: { type: Date, default: null },
    resolutionNote: { type: String, default: '' },
    reporterCount: { type: Number, default: 1 },
    escalatedTo: { type: String, enum: ['moderator', 'super_admin', null], default: null },
    lastActivityAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
    collection: process.env.SUPPORT_TICKET_COLLECTION || 'support_tickets',
  }
);

ticketSchema.index({ status: 1, updatedAt: -1 });
ticketSchema.index(
  { reportId: 1 },
  {
    unique: true,
    partialFilterExpression: { reportId: { $type: 'objectId' } },
  }
);

const TicketCounter = mongoose.models.TicketCounter || mongoose.model('TicketCounter', counterSchema);
const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

module.exports = {
  Ticket,
  TicketCounter,
};
