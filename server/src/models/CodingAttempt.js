const mongoose = require('mongoose');

const CodingAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingQuestion',
    required: true
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp'],
    default: 'javascript'
  },
  code: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Passed', 'Failed', 'Runtime Error', 'Time Limit Exceeded'],
    default: 'Passed'
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  totalTestCases: {
    type: Number,
    default: 0
  },
  runtimeMs: {
    type: Number,
    default: 45
  },
  aiFeedback: {
    isApproachCorrect: { type: Boolean, default: true },
    logicalMistakes: [{ type: String }],
    timeComplexity: { type: String, default: 'O(N)' },
    spaceComplexity: { type: String, default: 'O(1)' },
    betterApproach: { type: String, default: '' },
    testedConcepts: [{ type: String }],
    summary: { type: String, default: '' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CodingAttempt', CodingAttemptSchema);
