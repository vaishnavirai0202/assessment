// Import necessary modules
const express = require('express'); // Express framework for creating the router
const jwt = require('jsonwebtoken'); // JWT for verifying authentication tokens
const router = express.Router(); // Create a new router instance
const rateLimitingMiddleware = require('./rateLimit'); // Import rate-limiting middleware for managing API rate limits

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('x-auth-token'); // Retrieve the token from request headers
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' }); // Return error if token is missing
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode and verify the token using the secret
    req.user = decoded; // Attach decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' }); // Return error if token is invalid
  }
};

// GET /private route (protected)
// This route is protected by rate-limiting and token verification middleware
router.get('/private', rateLimitingMiddleware, verifyToken, (req, res) => {
  res.status(200).json({ 
    message: 'Welcome to the private dashboard!', 
    user: req.user // Respond with a welcome message and user details
  });
});

// Export the router for use in other parts of the application
module.exports = router;
