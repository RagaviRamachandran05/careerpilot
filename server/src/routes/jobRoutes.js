const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  saveJob,
  removeSavedJob,
  getSavedJobs
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getJobs);
router.get('/saved/all', getSavedJobs);
router.get('/:id', getJobById);
router.post('/:id/save', saveJob);
router.delete('/:id/save', removeSavedJob);

module.exports = router;
