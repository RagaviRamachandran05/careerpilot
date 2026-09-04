const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateSkills,
  addProject,
  deleteProject,
  addCertification,
  deleteCertification
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile);

router.put('/skills', updateSkills);
router.post('/projects', addProject);
router.delete('/projects/:projectId', deleteProject);
router.post('/certifications', addCertification);
router.delete('/certifications/:certId', deleteCertification);

module.exports = router;
