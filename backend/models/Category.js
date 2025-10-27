
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null , required : false},
  link: String,
  icon : String,
  description : String,
  background: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);

