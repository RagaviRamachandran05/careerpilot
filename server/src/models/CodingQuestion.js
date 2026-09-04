const mongoose = require('mongoose');

const CodingQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: [
      'Arrays',
      'Strings',
      'HashMap',
      'Searching',
      'Sorting',
      'Recursion',
      'Stack',
      'Queue',
      'Linked List',
      'Trees',
      'Graphs',
      'Dynamic Programming'
    ],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  inputFormat: {
    type: String,
    default: ''
  },
  outputFormat: {
    type: String,
    default: ''
  },
  constraints: [{ type: String }],
  examples: [{
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: '' }
  }],
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
  }],
  starterCode: {
    javascript: { type: String, default: '// Write your JavaScript solution here\nfunction solve() {\n  \n}' },
    python: { type: String, default: '# Write your Python solution here\ndef solve():\n    pass' },
    java: { type: String, default: '// Write your Java solution here\nclass Solution {\n    public void solve() {\n        \n    }\n}' },
    cpp: { type: String, default: '// Write your C++ solution here\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        \n    }\n};' }
  },
  solutionCode: {
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
    java: { type: String, default: '' },
    cpp: { type: String, default: '' }
  },
  solutionExplanation: {
    type: String,
    default: ''
  },
  expectedConcept: {
    type: String,
    default: ''
  },
  hints: [{ type: String }],
  timeComplexityExpected: {
    type: String,
    default: 'O(N)'
  },
  spaceComplexityExpected: {
    type: String,
    default: 'O(1)'
  },
  acceptanceRate: {
    type: Number,
    default: 75
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CodingQuestion', CodingQuestionSchema);
