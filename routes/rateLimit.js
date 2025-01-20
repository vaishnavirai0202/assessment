const express = require('express');
const router = express.Router();

const rateLimit = {}; // Object to store user request timestamps

const RATE_LIMIT = 5; // Max requests per minute
const WINDOW_TIME = 60 * 1000; // 1 minute in milliseconds

// Rate Limiting Middleware
const rateLimitingMiddleware = (req, res, next) => {
  const userIp = req.ip; // You can use req.user if you're identifying users with a token

  // Check if userIp exists in the rateLimit object
  if (!rateLimit[userIp]) {
    // Initialize user data if not exists
    rateLimit[userIp] = {
      requests: 1,
      firstRequestTime: Date.now()
    };
    return next();
  }

  // Get the current user data
  const userData = rateLimit[userIp];

  // Check if the current request is within the same 1-minute window
  const currentTime = Date.now();
  if (currentTime - userData.firstRequestTime < WINDOW_TIME) {
    // If under the limit, increment the request count
    if (userData.requests < RATE_LIMIT) {
      userData.requests++;
      return next();
    } else {
      // If the limit is exceeded, send a rate limit error
      return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }
  } else {
    // Reset count if it's a new window (1 minute has passed)
    userData.requests = 1;
    userData.firstRequestTime = currentTime;
    return next();
  }
};

// Apply rateLimitingMiddleware only to /private route
router.use('/private', rateLimitingMiddleware);

// // Example route to test the rate limiting
// router.get('/private', (req, res) => {
//   res.status(200).json({ message: 'Welcome to the private dashboard!' });
// });

module.exports = router;
