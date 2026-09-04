const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitQuestionAnswer,
  finalizeInterview,
  getInterviewHistory,
  getInterviewById
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/start', startInterview);
router.get('/history', getInterviewHistory);
router.get('/:id', getInterviewById);
router.post('/:id/answer', submitQuestionAnswer);
router.post('/:id/finalize', finalizeInterview);

module.exports = router;
