const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  discountPercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
    isGlobal: { type: Boolean, default: false }, 
    isActive: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);