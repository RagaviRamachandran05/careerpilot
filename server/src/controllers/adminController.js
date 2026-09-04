const User = require('../models/User');
const Job = require('../models/Job');
const CodingQuestion = require('../models/CodingQuestion');
const Assessment = require('../models/Assessment');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const LearningResource = require('../models/LearningResource');

// @desc    Get Platform Analytics for Admin Dashboard
// @route   GET /api/admin/analytics
// @access  Private (Admin Only)
const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalJobs = await Job.countDocuments({});
    const totalAssessments = await Assessment.countDocuments({});
    const totalInterviews = await Interview.countDocuments({});

    const students = await User.find({ role: 'student' });

    let avgReadiness = 0;
    let avgResume = 0;
    let avgCoding = 0;
    let avgInterview = 0;

    if (students.length > 0) {
      avgReadiness = Math.round(students.reduce((acc, s) => acc + (s.readinessScore?.overall || 50), 0) / students.length);
      avgResume = Math.round(students.reduce((acc, s) => acc + (s.readinessScore?.resume || 50), 0) / students.length);
      avgCoding = Math.round(students.reduce((acc, s) => acc + (s.readinessScore?.coding || 50), 0) / students.length);
      avgInterview = Math.round(students.reduce((acc, s) => acc + (s.readinessScore?.interview || 50), 0) / students.length);
    }

    // Target Role Distribution
    const roleCounts = {};
    students.forEach(s => {
      const role = s.careerPreferences?.targetRole || 'Full Stack Developer';
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    const roleDistribution = Object.keys(roleCounts).map(role => ({
      name: role,
      count: roleCounts[role]
    }));

    // Readiness distribution
    const readinessBrackets = [
      { name: 'Job Ready (>75%)', count: students.filter(s => (s.readinessScore?.overall || 0) >= 75).length },
      { name: 'Intermediate (50-74%)', count: students.filter(s => (s.readinessScore?.overall || 0) >= 50 && (s.readinessScore?.overall || 0) < 75).length },
      { name: 'Beginner (<50%)', count: students.filter(s => (s.readinessScore?.overall || 0) < 50).length }
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalJobs,
        totalAssessments,
        totalInterviews,
        avgReadiness,
        avgResume,
        avgCoding,
        avgInterview
      },
      roleDistribution,
      readinessBrackets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students with search & filters
// @route   GET /api/admin/students
// @access  Private (Admin Only)
const getStudents = async (req, res, next) => {
  try {
    const { search, targetRole, minScore } = req.query;
    const filter = { role: 'student' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'education.college': { $regex: search, $options: 'i' } }
      ];
    }

    if (targetRole && targetRole !== 'All') {
      filter['careerPreferences.targetRole'] = targetRole;
    }

    const students = await User.find(filter).sort({ 'readinessScore.overall': -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle student active status
// @route   PATCH /api/admin/students/:id/status
// @access  Private (Admin Only)
const toggleStudentStatus = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    student.isActive = !student.isActive;
    await student.save();

    res.status(200).json({
      success: true,
      message: `Student account ${student.isActive ? 'activated' : 'deactivated'} successfully!`,
      student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create new Job Listing
// @route   POST /api/admin/jobs
// @access  Private (Admin Only)
const createJob = async (req, res, next) => {
  try {
    const { title, company, location, experienceLevel, employmentType, salary, requiredSkills, preferredSkills, description, responsibilities, applicationUrl } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({ success: false, message: 'Please provide Title, Company, and Description.' });
    }

    const job = await Job.create({
      title,
      company,
      location: location || 'Bengaluru, India',
      experienceLevel: experienceLevel || 'Fresher',
      employmentType: employmentType || 'Full-time',
      salary: salary || 'Competitive',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : ['React', 'Node.js']),
      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : (preferredSkills ? preferredSkills.split(',').map(s => s.trim()) : []),
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
      applicationUrl: applicationUrl || 'https://careers.google.com',
      postedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Job listing published successfully!',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update Job Listing
// @route   PUT /api/admin/jobs/:id
// @access  Private (Admin Only)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Job listing updated!',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete Job Listing
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin Only)
const deleteJob = async (req, res, next) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Job listing removed.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create new Coding Question
// @route   POST /api/admin/coding
// @access  Private (Admin Only)
const createCodingQuestion = async (req, res, next) => {
  try {
    const { title, category, difficulty, description, inputFormat, outputFormat, examples, starterCode, expectedConcept, timeComplexityExpected } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: 'Please provide Title, Category, and Description.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const question = await CodingQuestion.create({
      title,
      slug: slug + '-' + Math.floor(Math.random() * 1000),
      category,
      difficulty: difficulty || 'Medium',
      description,
      inputFormat: inputFormat || '',
      outputFormat: outputFormat || '',
      examples: examples || [{ input: 'sample', output: 'sample', explanation: 'sample' }],
      starterCode: starterCode || {
        javascript: 'function solve(input) {\n  \n}'
      },
      expectedConcept: expectedConcept || '',
      timeComplexityExpected: timeComplexityExpected || 'O(N)'
    });

    res.status(201).json({
      success: true,
      message: 'Coding question created successfully!',
      question
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete Coding Question
// @route   DELETE /api/admin/coding/:id
// @access  Private (Admin Only)
const deleteCodingQuestion = async (req, res, next) => {
  try {
    await CodingQuestion.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Coding question removed.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all learning resources
// @route   GET /api/admin/resources
// @access  Private (Admin Only)
const getResources = async (req, res, next) => {
  try {
    const resources = await LearningResource.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: resources.length, resources });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create Learning Resource
// @route   POST /api/admin/resources
// @access  Private (Admin Only)
const createResource = async (req, res, next) => {
  try {
    const { title, category, skillTags, type, url, provider, difficulty } = req.body;
    if (!title || !url) {
      return res.status(400).json({ success: false, message: 'Title and URL are required' });
    }

    const resource = await LearningResource.create({
      title,
      category: category || 'General',
      skillTags: Array.isArray(skillTags) ? skillTags : (skillTags ? skillTags.split(',').map(s => s.trim()) : ['Web Development']),
      type: type || 'Documentation',
      url,
      provider: provider || 'Official Guide',
      difficulty: difficulty || 'Beginner'
    });

    res.status(201).json({
      success: true,
      message: 'Learning resource added!',
      resource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete Learning Resource
// @route   DELETE /api/admin/resources/:id
// @access  Private (Admin Only)
const deleteResource = async (req, res, next) => {
  try {
    await LearningResource.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Learning resource deleted.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminAnalytics,
  getStudents,
  toggleStudentStatus,
  createJob,
  updateJob,
  deleteJob,
  createCodingQuestion,
  deleteCodingQuestion,
  getResources,
  createResource,
  deleteResource
};
