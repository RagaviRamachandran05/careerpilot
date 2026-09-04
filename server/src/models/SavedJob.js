const mongoose = require('mongoose');

const SavedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected'],
    default: 'Saved'
  },
  notes: {
    type: String,
    default: ''
  },
  appliedDate: {
    type: Date
  },
  interviewDate: {
    type: Date
  },
  salaryOffered: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure a user can only save a specific job once
SavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', SavedJobSchema);
