const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');
const User = require('../models/User');
const { calculateJobMatch } = require('../services/ai/jobMatcher');

// @desc    Get all job listings with personalized match scores
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res, next) => {
  try {
    const { search, location, experienceLevel, minMatch } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location && location !== 'All') {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (experienceLevel && experienceLevel !== 'All') {
      filter.experienceLevel = experienceLevel;
    }

    let jobs = await Job.find(filter).sort({ createdAt: -1 });
    if (jobs.length === 0 && (!location || location === 'All') && (!experienceLevel || experienceLevel === 'All') && !search) {
      const { sampleJobs } = require('../seeds/seedData');
      await Job.insertMany(sampleJobs);
      jobs = await Job.find(filter).sort({ createdAt: -1 });
    }
    const user = await User.findById(req.user._id);

    // Get user's saved jobs
    const savedJobs = await SavedJob.find({ userId: req.user._id });
    const savedJobMap = new Map(savedJobs.map(sj => [sj.jobId.toString(), sj]));

    let enrichedJobs = jobs.map(job => {
      const matchResult = calculateJobMatch(user, job);
      const savedRecord = savedJobMap.get(job._id.toString());

      return {
        ...job.toObject(),
        matchScore: matchResult.matchPercentage,
        matchedRequired: matchResult.matchedRequired,
        missingRequired: matchResult.missingRequired,
        whyMatchReasons: matchResult.whyMatchReasons,
        improvementSuggestions: matchResult.improvementSuggestions,
        isSaved: !!savedRecord,
        savedStatus: savedRecord ? savedRecord.status : 'None',
        savedJobId: savedRecord ? savedRecord._id : null
      };
    });

    // Filter by minMatch if requested
    if (minMatch) {
      enrichedJobs = enrichedJobs.filter(j => j.matchScore >= Number(minMatch));
    }

    // Sort by highest matchScore descending
    enrichedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: enrichedJobs.length,
      jobs: enrichedJobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job listing not found.' });
    }

    const user = await User.findById(req.user._id);
    const matchResult = calculateJobMatch(user, job);
    const savedRecord = await SavedJob.findOne({ userId: req.user._id, jobId: job._id });

    res.status(200).json({
      success: true,
      job: {
        ...job.toObject(),
        matchScore: matchResult.matchPercentage,
        matchedRequired: matchResult.matchedRequired,
        missingRequired: matchResult.missingRequired,
        whyMatchReasons: matchResult.whyMatchReasons,
        improvementSuggestions: matchResult.improvementSuggestions,
        isSaved: !!savedRecord,
        savedStatus: savedRecord ? savedRecord.status : 'None',
        savedJobDetails: savedRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a job or update application status
// @route   POST /api/jobs/:id/save
// @access  Private
const saveJob = async (req, res, next) => {
  try {
    const { status = 'Saved', notes, salaryOffered } = req.body;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    let saved = await SavedJob.findOne({ userId: req.user._id, jobId });
    if (saved) {
      saved.status = status;
      if (notes !== undefined) saved.notes = notes;
      if (salaryOffered !== undefined) saved.salaryOffered = salaryOffered;
      if (status === 'Applied' && !saved.appliedDate) saved.appliedDate = new Date();
      await saved.save();
    } else {
      saved = await SavedJob.create({
        userId: req.user._id,
        jobId,
        status,
        notes: notes || '',
        salaryOffered: salaryOffered || '',
        appliedDate: status === 'Applied' ? new Date() : undefined
      });
    }

    res.status(200).json({
      success: true,
      message: `Job marked as "${status}"!`,
      savedJob: saved
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove saved job
// @route   DELETE /api/jobs/:id/save
// @access  Private
const removeSavedJob = async (req, res, next) => {
  try {
    await SavedJob.findOneAndDelete({ userId: req.user._id, jobId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job removed from saved list.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved/applied jobs for student
// @route   GET /api/jobs/saved/all
// @access  Private
const getSavedJobs = async (req, res, next) => {
  try {
    const savedList = await SavedJob.find({ userId: req.user._id })
      .populate('jobId')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: savedList.length,
      savedJobs: savedList
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  saveJob,
  removeSavedJob,
  getSavedJobs
};
