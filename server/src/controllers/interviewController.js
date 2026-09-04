const Interview = require('../models/Interview');
const User = require('../models/User');
const Resume = require('../models/Resume');
const { generateInterviewQuestions } = require('../services/ai/interviewGenerator');
const { evaluateAnswer, generateFinalInterviewReport } = require('../services/ai/interviewEvaluator');

// @desc    Start a new AI Mock Interview
// @route   POST /api/interviews/start
// @access  Private
const startInterview = async (req, res, next) => {
  try {
    const { targetRole, interviewType = 'Mixed', experienceLevel = 'Fresher/Entry Level' } = req.body;

    const user = await User.findById(req.user._id);
    const resume = await Resume.findOne({ userId: req.user._id, isCurrent: true });

    const roleToUse = targetRole || user?.careerPreferences?.targetRole || 'Full Stack Developer';

    const userContext = {
      skills: user?.skills || {},
      projects: user?.projects || [],
      resumeSkills: resume?.parsedData?.skills || []
    };

    // Generate personalized questions
    const generatedQuestions = await generateInterviewQuestions(roleToUse, interviewType, userContext);

    const questionsFormatted = generatedQuestions.map((q, idx) => ({
      questionIndex: idx,
      questionText: q.questionText,
      category: q.category || 'Technical',
      contextReference: q.contextReference || '',
      expectedKeyPoints: q.expectedKeyPoints || [],
      studentAnswer: '',
      answerMode: 'Text'
    }));

    const interview = await Interview.create({
      userId: req.user._id,
      targetRole: roleToUse,
      interviewType,
      experienceLevel,
      questions: questionsFormatted,
      currentQuestionIndex: 0,
      status: 'In Progress'
    });

    res.status(201).json({
      success: true,
      message: 'Mock Interview started! First question ready.',
      interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit answer to the current question & get real-time AI evaluation
// @route   POST /api/interviews/:id/answer
// @access  Private
const submitQuestionAnswer = async (req, res, next) => {
  try {
    const { questionIndex, studentAnswer, answerMode } = req.body;
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    const qItem = interview.questions[questionIndex];
    if (!qItem) {
      return res.status(400).json({ success: false, message: 'Invalid question index.' });
    }

    if (!studentAnswer || studentAnswer.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide an answer before proceeding.' });
    }

    // Evaluate via AI
    const evaluation = await evaluateAnswer(
      qItem.questionText,
      studentAnswer,
      qItem.expectedKeyPoints,
      qItem.category
    );

    qItem.studentAnswer = studentAnswer;
    qItem.answerMode = answerMode || 'Text';
    qItem.answeredAt = new Date();
    qItem.evaluation = evaluation;

    const nextIndex = questionIndex + 1;
    interview.currentQuestionIndex = nextIndex;

    const isLastQuestion = nextIndex >= interview.questions.length;

    if (isLastQuestion) {
      // Auto finalize report
      const finalReport = await generateFinalInterviewReport(
        interview.targetRole,
        interview.interviewType,
        interview.questions
      );
      interview.finalEvaluation = finalReport;
      interview.status = 'Completed';
      interview.completedAt = new Date();

      // Update user readiness score (convert 10-scale to 100-scale)
      const user = await User.findById(req.user._id);
      if (user) {
        const interviewScore100 = Math.round(finalReport.overallScore * 10);
        user.calculateReadinessScore({ interviewScore: interviewScore100 });
        await user.save();
      }
    }

    await interview.save();

    res.status(200).json({
      success: true,
      message: isLastQuestion ? 'Interview completed! Final report generated.' : 'Answer evaluated!',
      interview,
      currentEvaluation: evaluation,
      isCompleted: isLastQuestion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Finalize interview manually
// @route   POST /api/interviews/:id/finalize
// @access  Private
const finalizeInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    const finalReport = await generateFinalInterviewReport(
      interview.targetRole,
      interview.interviewType,
      interview.questions
    );

    interview.finalEvaluation = finalReport;
    interview.status = 'Completed';
    interview.completedAt = new Date();
    await interview.save();

    // Update user readiness
    const user = await User.findById(req.user._id);
    if (user) {
      const interviewScore100 = Math.round(finalReport.overallScore * 10);
      user.calculateReadinessScore({ interviewScore: interviewScore100 });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Interview finalized!',
      interview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interview session history
// @route   GET /api/interviews/history
// @access  Private
const getInterviewHistory = async (req, res, next) => {
  try {
    const history = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const completed = history.filter(i => i.status === 'Completed');
    const avgScore = completed.length > 0
      ? Number((completed.reduce((acc, i) => acc + (i.finalEvaluation?.overallScore || 0), 0) / completed.length).toFixed(1))
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalInterviews: history.length,
        completedCount: completed.length,
        averageScore: avgScore
      },
      history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single interview details
// @route   GET /api/interviews/:id
// @access  Private
const getInterviewById = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found.' });
    }

    res.status(200).json({
      success: true,
      interview
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startInterview,
  submitQuestionAnswer,
  finalizeInterview,
  getInterviewHistory,
  getInterviewById
};
