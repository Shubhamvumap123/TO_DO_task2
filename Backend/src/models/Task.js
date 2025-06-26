const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Task', taskSchema);