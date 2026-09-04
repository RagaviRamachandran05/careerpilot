const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword,
  resetPasswordViaEmail,
  demoStudentLogin,
  demoAdminLogin
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPasswordViaEmail);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.post('/demo-student', demoStudentLogin);
router.post('/demo-admin', demoAdminLogin);

module.exports = router;

