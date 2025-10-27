const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String }, 
  title: { type: String, required: true },
  message: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAnswer: { type: Number, default: 0 },
  answer: { type: Number, default: 0 },
  seen: { type: Boolean, default: false },
  userExists: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);