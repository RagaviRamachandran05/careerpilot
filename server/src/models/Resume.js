const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  extractedText: {
    type: String,
    default: ''
  },
  parsedData: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    education: [{ type: String }],
    skills: [{ type: String }],
    projects: [{ type: String }],
    experience: [{ type: String }],
    certifications: [{ type: String }],
    technologies: [{ type: String }],
    achievements: [{ type: String }]
  },
  analysis: {
    overallScore: { type: Number, default: 0 },
    breakdown: {
      skillsScore: { type: Number, default: 0 },
      projectsScore: { type: Number, default: 0 },
      educationScore: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 },
      achievementsScore: { type: Number, default: 0 },
      formattingScore: { type: Number, default: 0 },
      jobRelevanceScore: { type: Number, default: 0 }
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    keywordGaps: [{ type: String }],
    targetRoleMatch: {
      role: { type: String, default: '' },
      matchScore: { type: Number, default: 0 },
      matchedKeywords: [{ type: String }],
      missingKeywords: [{ type: String }]
    }
  },
  isCurrent: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', ResumeSchema);
