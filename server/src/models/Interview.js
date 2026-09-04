const mongoose = require('mongoose');

const InterviewQuestionItemSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  questionText: { type: String, required: true },
  category: { type: String, enum: ['Technical', 'HR', 'Behavioral', 'System Design'], default: 'Technical' },
  contextReference: { type: String, default: '' }, // e.g. "Referencing your MERN Project SkillSwap"
  expectedKeyPoints: [{ type: String }],
  studentAnswer: { type: String, default: '' },
  answerMode: { type: String, enum: ['Text', 'Voice'], default: 'Text' },
  answeredAt: { type: Date },
  evaluation: {
    technicalKnowledge: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
    confidenceClarity: { type: Number, default: 0 },
    completeness: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
    sampleIdealAnswer: { type: String, default: '' },
    strengths: [{ type: String }],
    improvements: [{ type: String }]
  }
}, { _id: true });

const InterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  interviewType: {
    type: String,
    enum: ['Technical', 'HR', 'Mixed'],
    default: 'Mixed'
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher/Entry Level', '1-2 Years', 'Senior'],
    default: 'Fresher/Entry Level'
  },
  questions: [InterviewQuestionItemSchema],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  finalEvaluation: {
    overallScore: { type: Number, default: 0 }, // 0 to 10 scale
    technicalKnowledgeScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendedTopics: [{ type: String }],
    executiveSummary: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Abandoned'],
    default: 'In Progress'
  },
  durationMinutes: {
    type: Number,
    default: 15
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', InterviewSchema);
