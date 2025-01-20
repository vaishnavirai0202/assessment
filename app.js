// Import necessary modules
const express = require('express'); // Express framework for building the server
const dotenv = require('dotenv'); // dotenv package for managing environment variables
const authRoutes = require('./routes/auth'); // Authentication-related routes
const privateRoutes = require('./routes/private'); // Routes for private/protected content
const rateLimitRoutes = require('./routes/rateLimit'); // Rate-limiting-related routes

// Load environment variables from a .env file into process.env
dotenv.config();

const app = express(); // Create an instance of the Express application
app.use(express.json()); // Middleware to parse incoming JSON payloads

// Define API routes
app.use('/api', authRoutes); // Attach authentication routes to the '/api' path
app.use('/api', privateRoutes); // Attach private/protected routes to the '/api' path
app.use('/api', rateLimitRoutes); // Attach rate-limiting routes to the '/api' path

// Start the server
const PORT = process.env.PORT || 3000; // Set the port from environment variables or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message indicating the server is running
});
