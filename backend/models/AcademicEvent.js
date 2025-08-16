const mongoose = require('mongoose');

const academicEventSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true, trim: true },
    start:   { type: Date,   required: true },
    end:     { type: Date,   required: true },
    allDay:  { type: Boolean, default: false },

    // Owner (who created it) — optional for future flexibility, but useful to restrict edits
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    // Mark events as global (visible to everyone)
    isGlobal: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Validation: start must be <= end
academicEventSchema.pre('validate', function(next) {
  if (this.start && this.end && this.start > this.end) {
    return next(new Error('Start date must be before end date'));
  }
  next();
});

// Helpful index for range queries
academicEventSchema.index({ start: 1, end: 1 });
academicEventSchema.index({ isGlobal: 1 });

module.exports = mongoose.model('AcademicEvent', academicEventSchema);
