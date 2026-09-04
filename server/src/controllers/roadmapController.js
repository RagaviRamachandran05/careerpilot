const LearningRoadmap = require('../models/LearningRoadmap');
const CareerGoal = require('../models/CareerGoal');
const User = require('../models/User');
const { generateRoadmapWithAI } = require('../services/ai/roadmapGenerator');
const { analyzeSkillGap } = require('../services/ai/skillGapAnalyzer');

// @desc    Get user's learning roadmap
// @route   GET /api/roadmap
// @access  Private
const getRoadmap = async (req, res, next) => {
  try {
    let roadmap = await LearningRoadmap.findOne({ userId: req.user._id });

    if (!roadmap) {
      const user = await User.findById(req.user._id);
      const targetRole = user?.careerPreferences?.targetRole || 'Full Stack Developer';
      const gapAnalysis = await analyzeSkillGap(user?.skills || {}, targetRole);

      const generated = await generateRoadmapWithAI(targetRole, gapAnalysis.missingSkills);

      roadmap = await LearningRoadmap.create({
        userId: req.user._id,
        targetRole,
        title: generated.title,
        overview: generated.overview,
        topics: generated.topics,
        aiRecommendation: generated.aiRecommendation
      });
      roadmap.updateProgress();
      await roadmap.save();
    }

    res.status(200).json({
      success: true,
      roadmap
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate a new AI personalized roadmap
// @route   POST /api/roadmap/generate
// @access  Private
const generateRoadmap = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const targetRole = req.body.targetRole || user?.careerPreferences?.targetRole || 'Full Stack Developer';

    const gapAnalysis = await analyzeSkillGap(user?.skills || {}, targetRole);
    const generated = await generateRoadmapWithAI(targetRole, gapAnalysis.missingSkills);

    let roadmap = await LearningRoadmap.findOne({ userId: req.user._id });
    if (roadmap) {
      roadmap.targetRole = targetRole;
      roadmap.title = generated.title;
      roadmap.overview = generated.overview;
      roadmap.topics = generated.topics;
      roadmap.aiRecommendation = generated.aiRecommendation;
      roadmap.updateProgress();
      await roadmap.save();
    } else {
      roadmap = await LearningRoadmap.create({
        userId: req.user._id,
        targetRole,
        title: generated.title,
        overview: generated.overview,
        topics: generated.topics,
        aiRecommendation: generated.aiRecommendation
      });
      roadmap.updateProgress();
      await roadmap.save();
    }

    res.status(200).json({
      success: true,
      message: 'AI Roadmap generated successfully!',
      roadmap
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a specific topic status
// @route   PATCH /api/roadmap/topics/:topicId/status
// @access  Private
const updateTopicStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Not Started', 'In Progress', 'Completed'
    const { topicId } = req.params;

    const roadmap = await LearningRoadmap.findOne({ userId: req.user._id });
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    }

    const topic = roadmap.topics.find(t => t.topicId === topicId || t._id.toString() === topicId);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found in roadmap.' });
    }

    topic.status = status;
    if (status === 'Completed') {
      topic.completedAt = new Date();
    }

    roadmap.updateProgress();
    await roadmap.save();

    res.status(200).json({
      success: true,
      message: `Topic marked as "${status}"!`,
      roadmap
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI learning recommendation based on recent performance
// @route   GET /api/roadmap/recommendations
// @access  Private
const getAIRecommendations = async (req, res, next) => {
  try {
    const roadmap = await LearningRoadmap.findOne({ userId: req.user._id });
    const inProgressTopic = roadmap?.topics.find(t => t.status === 'In Progress');
    const nextTopic = roadmap?.topics.find(t => t.status === 'Not Started');

    const focusTopic = inProgressTopic || nextTopic || { title: 'Advanced Backend APIs & System Design' };

    res.status(200).json({
      success: true,
      recommendation: {
        currentFocus: focusTopic.title,
        reasoning: `You should prioritize "${focusTopic.title}" because strengthening this area directly increases your placement readiness for ${roadmap?.targetRole || 'Full Stack Developer'}.`,
        nextAction: `Complete the key concepts and build the recommended mini-project milestone.`,
        suggestedResource: focusTopic.recommendedResources?.[0] || null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoadmap,
  generateRoadmap,
  updateTopicStatus,
  getAIRecommendations
};
