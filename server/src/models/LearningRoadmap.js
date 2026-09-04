const mongoose = require('mongoose');

const RoadmapTopicSchema = new mongoose.Schema({
  topicId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Core' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  estimatedHours: { type: Number, default: 10 },
  monthPhase: { type: String, default: 'Month 1' },
  phaseOrder: { type: Number, default: 1 },
  prerequisites: [{ type: String }],
  keyConcepts: [{ type: String }],
  projectIdea: {
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  recommendedResources: [{
    title: { type: String, required: true },
    type: { type: String, enum: ['Article', 'Video', 'Course', 'Documentation', 'Interactive'], default: 'Documentation' },
    url: { type: String, default: '' },
    provider: { type: String, default: '' },
    isFree: { type: Boolean, default: true }
  }],
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  completedAt: { type: Date }
}, { _id: true });

const LearningRoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Personalized Career Learning Roadmap'
  },
  overview: {
    type: String,
    default: ''
  },
  topics: [RoadmapTopicSchema],
  totalTopics: { type: Number, default: 0 },
  completedTopics: { type: Number, default: 0 },
  progressPercentage: { type: Number, default: 0 },
  generatedByAI: { type: Boolean, default: true },
  aiRecommendation: {
    currentFocus: { type: String, default: '' },
    reasoning: { type: String, default: '' },
    nextAction: { type: String, default: '' },
    recommendedResourceId: { type: String, default: '' }
  }
}, {
  timestamps: true
});

LearningRoadmapSchema.methods.updateProgress = function () {
  this.totalTopics = this.topics.length;
  this.completedTopics = this.topics.filter(t => t.status === 'Completed').length;
  this.progressPercentage = this.totalTopics > 0 
    ? Math.round((this.completedTopics / this.totalTopics) * 100) 
    : 0;
  return this.progressPercentage;
};

module.exports = mongoose.model('LearningRoadmap', LearningRoadmapSchema);
