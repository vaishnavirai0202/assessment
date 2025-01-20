// Import necessary modules
const express = require('express'); // Express framework for creating the router
const router = express.Router(); // Create a new router instance

const rateLimit = {}; // Object to store user request timestamps for rate limiting

const RATE_LIMIT = 5; // Maximum number of requests allowed per minute per user
const WINDOW_TIME = 60 * 1000; // Time window for rate limiting (1 minute in milliseconds)

// Rate Limiting Middleware
const rateLimitingMiddleware = (req, res, next) => {
  const userIp = req.ip; // Identify users based on their IP address (can be replaced with tokens for authenticated users)

  // Check if the user IP is already tracked in the rateLimit object
  if (!rateLimit[userIp]) {
    // Initialize the user's data if it doesn't exist
    rateLimit[userIp] = {
      requests: 1, // Start with 1 request
      firstRequestTime: Date.now() // Record the timestamp of the first request
    };
    return next(); // Allow the request
  }

  // Retrieve the current user's data
  const userData = rateLimit[userIp];

  // Get the current time
  const currentTime = Date.now();

  // Check if the request is within the same rate limit window (1 minute)
  if (currentTime - userData.firstRequestTime < WINDOW_TIME) {
    // If the user is still under the request limit
    if (userData.requests < RATE_LIMIT) {
      userData.requests++; // Increment the request count
      return next(); // Allow the request
    } else {
      // Deny the request if the rate limit is exceeded
      return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }
  } else {
    // If the 1-minute window has passed, reset the user's request count and timestamp
    userData.requests = 1; // Reset request count
    userData.firstRequestTime = currentTime; // Reset the timestamp
    return next(); // Allow the request
  }
};

// Apply rateLimitingMiddleware only to /private route
router.use('/private', rateLimitingMiddleware);

// Export the router for use in other parts of the application
module.exports = router;
