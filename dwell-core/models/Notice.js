const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['General', 'Maintenance', 'Event', 'Emergency', 'Finance'], default: 'General' },
  priority: { type: String, enum: ['Normal', 'Important', 'Urgent'], default: 'Normal' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', noticeSchema);
