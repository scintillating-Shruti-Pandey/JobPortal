const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, logout, getMe, updateProfile, googleCallback } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/auth?error=google_failed`, session: false }),
  googleCallback
);

module.exports = router;
