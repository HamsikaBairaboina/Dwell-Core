const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  flatNo: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  maintenance: { type: Number, default: 0 },
  water: { type: Number, default: 0 },
  power: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  paidAt: { type: Date },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

billSchema.pre('save', function (next) {
  this.totalAmount = (this.maintenance || 0) + (this.water || 0) + (this.power || 0);
  next();
});

module.exports = mongoose.model('Bill', billSchema);
