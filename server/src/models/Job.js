const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true
  },
  companyLogo: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: [true, 'Please provide a job location'],
    default: 'Bengaluru, India (Hybrid)'
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', '0-1 Years', '1-3 Years', '3+ Years'],
    default: 'Fresher'
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Internship', 'Remote', 'Contract'],
    default: 'Full-time'
  },
  salary: {
    type: String,
    default: 'Competitive / As per industry standards'
  },
  requiredSkills: [{
    type: String,
    required: true
  }],
  preferredSkills: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  responsibilities: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  applicationUrl: {
    type: String,
    default: 'https://careers.google.com'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', JobSchema);
