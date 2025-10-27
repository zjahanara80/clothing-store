const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  chekide : {type: String, required: true },
  cover: { type: String }, // مسیر عکس کاور
  slug: { type: String, required: true, unique: true }, // لینک مقاله
  category: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
  isDraft: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);