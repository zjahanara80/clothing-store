const mongoose = require('mongoose');

const commentArticleSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, required: true },
  isVerifiedUser: { type: Boolean, default: false },
  approved: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('CommentArticle', commentArticleSchema);
