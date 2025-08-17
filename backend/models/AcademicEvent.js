// backend/models/AcademicEvent.js
const mongoose = require('mongoose');

const academicEventSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  start:    { type: Date,   required: true },
  end:      { type: Date,   required: true },
  allDay:   { type: Boolean, default: false },
  isGlobal: { type: Boolean, default: true },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('AcademicEvent', academicEventSchema);
