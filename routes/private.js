const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const rateLimitingMiddleware = require('./rateLimit');
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// GET /private route (protected)
// router.get('/private', verifyToken, (req, res) => {
//   res.status(200).json({ message: 'Welcome to the private dashboard!', user: req.user });
// });
router.get('/private', rateLimitingMiddleware, verifyToken, (req, res) => {
    res.status(200).json({ message: 'Welcome to the private dashboard!', user: req.user });
  });
module.exports = router;
