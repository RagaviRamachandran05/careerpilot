const mongoose = require('mongoose');

const AssessmentQuestionRecordSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingQuestion'
  },
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  description: { type: String, default: '' },
  userCode: { type: String, default: '' },
  solutionCode: { type: String, default: '' },
  solutionExplanation: { type: String, default: '' },
  language: { type: String, default: 'javascript' },
  passed: { type: Boolean, default: false },
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 }
}, { _id: true });


const AssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Timed Coding Assessment'
  },
  category: {
    type: String,
    default: 'General'
  },
  difficulty: {
    type: String,
    enum: ['Mixed', 'Easy', 'Medium', 'Hard'],
    default: 'Mixed'
  },
  durationMinutes: {
    type: Number,
    default: 45
  },
  timeSpentSeconds: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  solvedCount: {
    type: Number,
    default: 0
  },
  scorePercentage: {
    type: Number,
    default: 0
  },
  questions: [AssessmentQuestionRecordSchema],
  strongAreas: [{ type: String }],
  needsImprovement: [{ type: String }],
  aiSummary: {
    type: String,
    default: ''
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
