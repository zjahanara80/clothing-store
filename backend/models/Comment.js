const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, required: true },
  isVerifiedUser: { type: Boolean, default: false },
  approved: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
