const CareerGoal = require('../models/CareerGoal');
const User = require('../models/User');
const { ROLE_SKILL_BENCHMARKS, analyzeSkillGap } = require('../services/ai/skillGapAnalyzer');

// @desc    Get current user's career goal
// @route   GET /api/career
// @access  Private
const getCareerGoal = async (req, res, next) => {
  try {
    let goal = await CareerGoal.findOne({ userId: req.user._id });
    const user = await User.findById(req.user._id);

    if (!goal && user) {
      const analysis = await analyzeSkillGap(user.skills, user.careerPreferences?.targetRole || 'Full Stack Developer');
      goal = await CareerGoal.create({
        userId: user._id,
        targetRole: analysis.targetRole,
        requiredSkills: analysis.requiredSkills,
        acquiredSkills: analysis.acquiredSkills,
        missingSkills: analysis.missingSkills,
        matchPercentage: analysis.matchPercentage,
        readinessLevel: analysis.readinessLevel
      });
    }

    res.status(200).json({
      success: true,
      careerGoal: goal,
      availableRoles: Object.keys(ROLE_SKILL_BENCHMARKS)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update target career role & calculate required benchmark skills
// @route   POST /api/career/set-target
// @access  Private
const setTargetRole = async (req, res, next) => {
  try {
    const { targetRole, customSkills, targetTimelineMonths } = req.body;
    if (!targetRole) {
      return res.status(400).json({ success: false, message: 'Please specify a target career role.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update user preferences
    user.careerPreferences = {
      ...user.careerPreferences,
      targetRole
    };

    // Calculate skill gap
    const analysis = await analyzeSkillGap(user.skills, targetRole);

    // Upsert CareerGoal
    let goal = await CareerGoal.findOne({ userId: user._id });
    if (goal) {
      goal.targetRole = targetRole;
      goal.requiredSkills = analysis.requiredSkills;
      goal.acquiredSkills = analysis.acquiredSkills;
      goal.missingSkills = analysis.missingSkills;
      goal.matchPercentage = analysis.matchPercentage;
      goal.readinessLevel = analysis.readinessLevel;
      if (targetTimelineMonths) goal.targetTimelineMonths = targetTimelineMonths;
      await goal.save();
    } else {
      goal = await CareerGoal.create({
        userId: user._id,
        targetRole,
        requiredSkills: analysis.requiredSkills,
        acquiredSkills: analysis.acquiredSkills,
        missingSkills: analysis.missingSkills,
        matchPercentage: analysis.matchPercentage,
        readinessLevel: analysis.readinessLevel,
        targetTimelineMonths: targetTimelineMonths || 6
      });
    }

    // Update readiness score
    user.calculateReadinessScore({ skillScore: analysis.matchPercentage });
    await user.save();

    res.status(200).json({
      success: true,
      message: `Career goal set to ${targetRole}!`,
      careerGoal: goal,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCareerGoal,
  setTargetRole
};
