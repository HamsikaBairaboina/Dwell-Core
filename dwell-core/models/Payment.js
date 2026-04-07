const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bill: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['Online', 'Cash', 'Bank Transfer'], default: 'Online' },
  transactionId: { type: String, default: '' },
  flatNo: { type: String },
  month: { type: String },
  year: { type: Number },
  paidAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
