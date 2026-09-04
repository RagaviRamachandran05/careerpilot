const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getCurrentResume,
  reanalyzeResume,
  deleteResume
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/upload', uploadResume);
router.get('/current', getCurrentResume);
router.post('/analyze', reanalyzeResume);
router.delete('/:id', deleteResume);

module.exports = router;
