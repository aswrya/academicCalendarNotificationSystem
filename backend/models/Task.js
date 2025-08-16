// backend/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    deadline: { type: Date, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
