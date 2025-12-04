const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  signup,
  login,
  getMe,
  updateProfile,
  completeOnboarding,
  changePassword,
  deleteAccount,
  socialAuth
} = require('../controllers/authController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/social', socialAuth);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/complete-onboarding', protect, completeOnboarding);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
