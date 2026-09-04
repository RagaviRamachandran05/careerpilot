const User = require('../models/User');
const { ROLE_SKILL_BENCHMARKS, analyzeSkillGap } = require('../services/ai/skillGapAnalyzer');

// @desc    Get detailed skill gap analysis
// @route   GET /api/skills/gap-analysis
// @access  Private
const getSkillGapAnalysis = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const targetRole = req.query.role || user?.careerPreferences?.targetRole || 'Full Stack Developer';

    const analysis = await analyzeSkillGap(user ? user.skills : {}, targetRole);

    res.status(200).json({
      success: true,
      analysis,
      availableRoles: Object.keys(ROLE_SKILL_BENCHMARKS)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkillGapAnalysis
};
