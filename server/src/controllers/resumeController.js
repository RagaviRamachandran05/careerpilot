const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { parseResumeText, analyzeResumeWithAI } = require('../services/ai/resumeAnalyzer');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (Only PDF)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are supported for resume analysis!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
}).single('resume');

// @desc    Upload PDF resume and run AI analysis
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select and upload a valid PDF resume file.' });
    }

    try {
      // Read file buffer for PDF parsing
      const dataBuffer = fs.readFileSync(req.file.path);
      let extractedText = '';
      try {
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text || '';
      } catch (pdfErr) {
        console.warn('PDF parse warning, using fallback text parser:', pdfErr.message);
        extractedText = req.file.originalname.replace(/\.[^/.]+$/, '') + ' Resume';
      }

      // Fetch user to determine target role
      const user = await User.findById(req.user._id);
      const targetRole = req.body.targetRole || user?.careerPreferences?.targetRole || 'Full Stack Developer';

      // 1. Extract Structured Data via AI
      const parsedData = await parseResumeText(extractedText);

      // 2. Score Resume and Generate Feedback via AI
      const analysis = await analyzeResumeWithAI(extractedText, targetRole, parsedData);

      // 3. Mark previous resumes as not current
      await Resume.updateMany({ userId: req.user._id }, { isCurrent: false });

      // 4. Save to Database
      const resume = await Resume.create({
        userId: req.user._id,
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        extractedText,
        parsedData,
        analysis,
        isCurrent: true
      });

      // 5. Update user readiness score
      if (user) {
        user.calculateReadinessScore({ resumeScore: analysis.overallScore });
        await user.save();
      }

      res.status(201).json({
        success: true,
        message: 'Resume uploaded and analyzed successfully!',
        resume
      });
    } catch (error) {
      next(error);
    }
  });
};

// @desc    Get current active resume
// @route   GET /api/resume/current
// @access  Private
const getCurrentResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id, isCurrent: true }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(200).json({
        success: true,
        resume: null,
        message: 'No resume uploaded yet.'
      });
    }

    res.status(200).json({
      success: true,
      resume
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Re-analyze resume against a specific target role
// @route   POST /api/resume/analyze
// @access  Private
const reanalyzeResume = async (req, res, next) => {
  try {
    const { targetRole } = req.body;
    const resume = await Resume.findOne({ userId: req.user._id, isCurrent: true });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Please upload a resume first.' });
    }

    const analysis = await analyzeResumeWithAI(
      resume.extractedText || JSON.stringify(resume.parsedData),
      targetRole || 'Full Stack Developer',
      resume.parsedData
    );

    resume.analysis = analysis;
    await resume.save();

    // Update user score
    const user = await User.findById(req.user._id);
    if (user) {
      user.calculateReadinessScore({ resumeScore: analysis.overallScore });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: `Resume re-analyzed for ${targetRole}!`,
      analysis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    await Resume.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  getCurrentResume,
  reanalyzeResume,
  deleteResume
};
