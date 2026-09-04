const express = require('express');
const router = express.Router();
const {
  getRoadmap,
  generateRoadmap,
  updateTopicStatus,
  getAIRecommendations
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getRoadmap);
router.post('/generate', generateRoadmap);
router.patch('/topics/:topicId/status', updateTopicStatus);
router.get('/recommendations', getAIRecommendations);

module.exports = router;
