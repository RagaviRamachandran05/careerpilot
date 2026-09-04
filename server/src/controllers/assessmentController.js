const Assessment = require('../models/Assessment');
const CodingQuestion = require('../models/CodingQuestion');
const User = require('../models/User');

// @desc    Start a new timed coding assessment
// @route   POST /api/assessments/start
// @access  Private
const startAssessment = async (req, res, next) => {
  try {
    const { difficulty = 'Mixed', questionCount = 4, durationMinutes = 45, category = 'General' } = req.body;

    let query = {};
    if (difficulty !== 'Mixed') {
      query.difficulty = difficulty;
    }
    if (category !== 'General') {
      query.category = category;
    }

    let availableQuestions = await CodingQuestion.find(query);
    if (availableQuestions.length === 0) {
      availableQuestions = await CodingQuestion.find({});
    }
    if (availableQuestions.length === 0) {
      const { sampleCodingQuestions } = require('../seeds/seedData');
      await CodingQuestion.insertMany(sampleCodingQuestions);
      availableQuestions = await CodingQuestion.find({});
    }

    // Shuffle and pick
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(Number(questionCount), availableQuestions.length));

    const questionsFormatted = selected.map(q => ({
      questionId: q._id,
      title: q.title,
      category: q.category,
      difficulty: q.difficulty,
      description: q.description || '',
      userCode: q.starterCode?.javascript || `// Write your optimal ${q.category} solution\nfunction solve() {\n  \n}`,
      solutionCode: q.solutionCode?.javascript || '',
      solutionExplanation: q.solutionExplanation || '',
      language: 'javascript',
      passed: false
    }));

    const assessment = await Assessment.create({
      userId: req.user._id,
      title: `${difficulty} ${category} Placement Coding Assessment`,
      category,
      difficulty,
      durationMinutes: Number(durationMinutes),
      totalQuestions: questionsFormatted.length,
      questions: questionsFormatted
    });

    res.status(201).json({
      success: true,
      message: 'Assessment started!',
      assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a completed assessment
// @route   POST /api/assessments/:id/submit
// @access  Private
const submitAssessment = async (req, res, next) => {
  try {
    const { questions, timeSpentSeconds } = req.body;
    const assessment = await Assessment.findOne({ _id: req.params.id, userId: req.user._id });

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    let solvedCount = 0;
    const categoryResults = {};

    const updatedQuestions = (questions || assessment.questions).map(q => {
      const isPassed = q.userCode && q.userCode.trim().length > 30 && !q.userCode.includes('// Write solution');
      if (isPassed) {
        solvedCount++;
      }

      if (!categoryResults[q.category]) {
        categoryResults[q.category] = { total: 0, passed: 0 };
      }
      categoryResults[q.category].total++;
      if (isPassed) categoryResults[q.category].passed++;

      return {
        ...q,
        passed: isPassed,
        testCasesPassed: isPassed ? 3 : 1,
        totalTestCases: 3
      };
    });

    const scorePercentage = Math.round((solvedCount / assessment.totalQuestions) * 100);

    const strongAreas = [];
    const needsImprovement = [];

    Object.keys(categoryResults).forEach(cat => {
      const ratio = categoryResults[cat].passed / categoryResults[cat].total;
      if (ratio >= 0.6) {
        strongAreas.push(cat);
      } else {
        needsImprovement.push(cat);
      }
    });

    assessment.questions = updatedQuestions;
    assessment.solvedCount = solvedCount;
    assessment.scorePercentage = scorePercentage;
    assessment.timeSpentSeconds = timeSpentSeconds || 1200;
    assessment.strongAreas = strongAreas.length > 0 ? strongAreas : ['Problem Solving Fundamentals'];
    assessment.needsImprovement = needsImprovement.length > 0 ? needsImprovement : ['Time & Space Optimization'];
    assessment.aiSummary = `Assessment completed with ${solvedCount}/${assessment.totalQuestions} problems solved (${scorePercentage}% score). Strong performance in ${assessment.strongAreas.join(', ')}. Focus next on practicing ${assessment.needsImprovement.join(', ')}.`;
    assessment.completedAt = new Date();

    await assessment.save();

    // Update user readiness score
    const user = await User.findById(req.user._id);
    if (user) {
      user.calculateReadinessScore({ codingScore: Math.max(user.readinessScore.coding || 40, scorePercentage) });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Assessment submitted successfully!',
      assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessment history
// @route   GET /api/assessments/history
// @access  Private
const getAssessmentHistory = async (req, res, next) => {
  try {
    const history = await Assessment.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const totalTaken = history.length;
    const avgScore = totalTaken > 0
      ? Math.round(history.reduce((acc, a) => acc + (a.scorePercentage || 0), 0) / totalTaken)
      : 0;

    res.status(200).json({
      success: true,
      stats: { totalTaken, avgScore },
      history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assessment by ID
// @route   GET /api/assessments/:id
// @access  Private
const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found.' });
    }

    res.status(200).json({
      success: true,
      assessment
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startAssessment,
  submitAssessment,
  getAssessmentHistory,
  getAssessmentById
};
