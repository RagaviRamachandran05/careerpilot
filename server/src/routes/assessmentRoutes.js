const express = require('express');
const router = express.Router();
const {
  startAssessment,
  submitAssessment,
  getAssessmentHistory,
  getAssessmentById
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/start', startAssessment);
router.get('/history', getAssessmentHistory);
router.get('/:id', getAssessmentById);
router.post('/:id/submit', submitAssessment);

module.exports = router;
