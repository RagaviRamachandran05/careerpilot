const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getQuestionBySlug,
  submitSolution,
  getUserAttempts
} = require('../controllers/codingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/questions', getQuestions);
router.get('/questions/:slug', getQuestionBySlug);
router.post('/questions/:id/submit', submitSolution);
router.get('/attempts', getUserAttempts);

module.exports = router;
