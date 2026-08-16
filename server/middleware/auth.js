const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

const isEmployer = (req, res, next) => {
  if (req.user && req.user.role === 'employer') return next();
  return res.status(403).json({ success: false, message: 'Only employers can perform this action' });
};

const isSeeker = (req, res, next) => {
  if (req.user && req.user.role === 'seeker') return next();
  return res.status(403).json({ success: false, message: 'Only job seekers can perform this action' });
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      headline: user.headline,
      companyName: user.companyName,
      companyLogo: user.companyLogo,
      isGoogleAuth: user.isGoogleAuth,
    },
  });
};

module.exports = { protect, isEmployer, isSeeker, generateToken, sendTokenResponse };
