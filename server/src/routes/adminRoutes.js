const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getStudents,
  toggleStudentStatus,
  createJob,
  updateJob,
  deleteJob,
  createCodingQuestion,
  deleteCodingQuestion,
  getResources,
  createResource,
  deleteResource
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/analytics', getAdminAnalytics);
router.get('/students', getStudents);
router.patch('/students/:id/status', toggleStudentStatus);

router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

router.post('/coding', createCodingQuestion);
router.delete('/coding/:id', deleteCodingQuestion);

router.get('/resources', getResources);
router.post('/resources', createResource);
router.delete('/resources/:id', deleteResource);

module.exports = router;
