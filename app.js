const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const privateRoutes = require('./routes/private');
const rateLimitRoutes = require('./routes/rateLimit');
// Load environment variables
dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Routes
app.use('/api', authRoutes);
app.use('/api', privateRoutes);
app.use('/api', rateLimitRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
