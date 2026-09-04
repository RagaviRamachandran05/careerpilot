const mongoose = require('mongoose');

const LearningResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  skillTags: [{
    type: String,
    required: true
  }],
  type: {
    type: String,
    enum: ['Course', 'Article', 'Video', 'Documentation', 'Interactive', 'CheatSheet'],
    default: 'Documentation'
  },
  url: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    default: 'FreeCodeCamp / Official Docs'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  estimatedDuration: {
    type: String,
    default: '2-4 hours'
  },
  isFree: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.8
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LearningResource', LearningResourceSchema);
