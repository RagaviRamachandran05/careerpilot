const mongoose = require('mongoose');

const CareerGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  targetIndustry: {
    type: String,
    default: 'Software & Technology'
  },
  targetTimelineMonths: {
    type: Number,
    default: 6
  },
  requiredSkills: [{
    name: { type: String, required: true },
    category: { type: String, default: 'Technical' },
    importance: { type: String, enum: ['Critical', 'High', 'Medium', 'Good to have'], default: 'High' }
  }],
  acquiredSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  matchPercentage: {
    type: Number,
    default: 0
  },
  readinessLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Job Ready', 'Advanced'],
    default: 'Intermediate'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CareerGoal', CareerGoalSchema);
