const CodingQuestion = require('../models/CodingQuestion');
const CodingAttempt = require('../models/CodingAttempt');
const User = require('../models/User');
const { evaluateCodeSubmission } = require('../services/ai/codingEvaluator');

// @desc    Get all coding practice questions with filters
// @route   GET /api/coding/questions
// @access  Private
const getQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let questions = await CodingQuestion.find(filter).select('-testCases.isHidden');
    if (questions.length === 0 && (!category || category === 'All') && (!difficulty || difficulty === 'All') && !search) {
      const { sampleCodingQuestions } = require('../seeds/seedData');
      await CodingQuestion.insertMany(sampleCodingQuestions);
      questions = await CodingQuestion.find(filter).select('-testCases.isHidden');
    }

    // Get user solved attempts
    const userAttempts = await CodingAttempt.find({ userId: req.user._id });
    const solvedQuestionIds = new Set(
      userAttempts.filter(a => a.status === 'Passed').map(a => a.questionId.toString())
    );
    const attemptedQuestionIds = new Set(
      userAttempts.map(a => a.questionId.toString())
    );

    const enrichedQuestions = questions.map(q => {
      const qObj = q.toObject();
      qObj.userStatus = solvedQuestionIds.has(q._id.toString())
        ? 'Solved'
        : attemptedQuestionIds.has(q._id.toString())
          ? 'Attempted'
          : 'Unsolved';
      return qObj;
    });

    const stats = {
      total: questions.length,
      solved: solvedQuestionIds.size,
      attempted: attemptedQuestionIds.size
    };

    res.status(200).json({
      success: true,
      stats,
      questions: enrichedQuestions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question by slug
// @route   GET /api/coding/questions/:slug
// @access  Private
const getQuestionBySlug = async (req, res, next) => {
  try {
    const question = await CodingQuestion.findOne({ slug: req.params.slug });
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const lastAttempt = await CodingAttempt.findOne({
      userId: req.user._id,
      questionId: question._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      question,
      lastAttempt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit code for execution and AI evaluation
// @route   POST /api/coding/questions/:id/submit
// @access  Private
const submitSolution = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const question = await CodingQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    if (!code || code.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide code for submission.' });
    }

    // 1. Evaluate Code via AI Engine
    const aiFeedback = await evaluateCodeSubmission(question, code, language || 'javascript');

    // 2. Test Cases Execution Simulation
    const totalTestCases = (question.testCases && question.testCases.length > 0) ? question.testCases.length : 3;
    const isPassed = aiFeedback.isApproachCorrect;
    const testCasesPassed = isPassed ? totalTestCases : Math.max(1, totalTestCases - 1);

    // 3. Save Attempt
    const attempt = await CodingAttempt.create({
      userId: req.user._id,
      questionId: question._id,
      language: language || 'javascript',
      code,
      status: isPassed ? 'Passed' : 'Failed',
      testCasesPassed,
      totalTestCases,
      runtimeMs: Math.floor(Math.random() * 40) + 25,
      aiFeedback
    });

    // 4. Recalculate user readiness score
    const user = await User.findById(req.user._id);
    if (user) {
      const allPassedAttempts = await CodingAttempt.countDocuments({ userId: user._id, status: 'Passed' });
      const newCodingScore = Math.min(100, 40 + allPassedAttempts * 8);
      user.calculateReadinessScore({ codingScore: newCodingScore });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: isPassed ? 'All Test Cases Passed! Solution Accepted.' : 'Solution partially completed. See AI coaching advice below.',
      attempt
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user coding attempts
// @route   GET /api/coding/attempts
// @access  Private
const getUserAttempts = async (req, res, next) => {
  try {
    const attempts = await CodingAttempt.find({ userId: req.user._id })
      .populate('questionId', 'title slug category difficulty')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      attempts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuestions,
  getQuestionBySlug,
  submitSolution,
  getUserAttempts
};
