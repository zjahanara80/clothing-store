const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  countInStock: Number,
  isSuggest: Boolean,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  size: [{ type: String }],
  code: [{ type: Number, unique: true, }],
  img: [{ type: String }],
  isOffer: Boolean,
  offerDetails: [{ type: String }],
  discount: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

productSchema.virtual('globalDiscount').get(function () {
  return this._globalDiscount || 0;
});


module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);

