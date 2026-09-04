const express = require('express');
const router = express.Router();
const {
  getCareerGoal,
  setTargetRole
} = require('../controllers/careerGoalController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getCareerGoal);
router.post('/set-target', setTargetRole);

module.exports = router;
