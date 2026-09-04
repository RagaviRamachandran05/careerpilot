const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false }
}, { _id: true });

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, default: '' },
  url: { type: String, default: '' }
}, { _id: true });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  education: {
    college: { type: String, default: '' },
    degree: { type: String, default: '' },
    department: { type: String, default: '' },
    graduationYear: { type: Number, default: new Date().getFullYear() + 1 },
    cgpa: { type: String, default: '' }
  },
  skills: {
    languages: [{ type: String }],
    frameworks: [{ type: String }],
    databases: [{ type: String }],
    tools: [{ type: String }],
    softSkills: [{ type: String }]
  },
  careerPreferences: {
    targetRole: { type: String, default: 'Full Stack Developer' },
    preferredTech: [{ type: String }],
    preferredLocation: { type: String, default: 'Any' },
    preferredEmploymentType: { type: String, default: 'Full-time' },
    expectedSalary: { type: String, default: '' }
  },
  projects: [ProjectSchema],
  certifications: [CertificationSchema],
  readinessScore: {
    overall: { type: Number, default: 45 },
    resume: { type: Number, default: 50 },
    skills: { type: Number, default: 40 },
    coding: { type: Number, default: 35 },
    interview: { type: Number, default: 40 },
    projects: { type: Number, default: 60 },
    history: [{
      date: { type: Date, default: Date.now },
      score: { type: Number }
    }],
    lastCalculated: { type: Date, default: Date.now }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate and update user readiness score
UserSchema.methods.calculateReadinessScore = function (extraMetrics = {}) {
  const resumeScore = extraMetrics.resumeScore ?? this.readinessScore.resume ?? 50;
  const skillScore = extraMetrics.skillScore ?? this.readinessScore.skills ?? 40;
  const codingScore = extraMetrics.codingScore ?? this.readinessScore.coding ?? 35;
  const interviewScore = extraMetrics.interviewScore ?? this.readinessScore.interview ?? 40;
  
  // Projects score based on project quantity & quality
  let projectsScore = 20;
  if (this.projects && this.projects.length > 0) {
    projectsScore = Math.min(100, this.projects.length * 30 + (this.projects.some(p => p.liveUrl || p.githubUrl) ? 20 : 0));
  }

  // Weighted sum: Resume 25%, Skills 25%, Coding 20%, Interview 20%, Projects 10%
  const overall = Math.round(
    (resumeScore * 0.25) +
    (skillScore * 0.25) +
    (codingScore * 0.20) +
    (interviewScore * 0.20) +
    (projectsScore * 0.10)
  );

  this.readinessScore.resume = resumeScore;
  this.readinessScore.skills = skillScore;
  this.readinessScore.coding = codingScore;
  this.readinessScore.interview = interviewScore;
  this.readinessScore.projects = projectsScore;
  this.readinessScore.overall = overall;
  this.readinessScore.lastCalculated = new Date();

  if (!this.readinessScore.history) {
    this.readinessScore.history = [];
  }
  this.readinessScore.history.push({
    date: new Date(),
    score: overall
  });

  return overall;
};

module.exports = mongoose.model('User', UserSchema);
