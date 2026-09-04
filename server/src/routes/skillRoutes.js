const express = require('express');
const router = express.Router();
const { getSkillGapAnalysis } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/gap-analysis', getSkillGapAnalysis);

module.exports = router;
