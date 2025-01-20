// Import necessary modules
const express = require('express'); // Express for creating and handling routes
const bcrypt = require('bcryptjs'); // Bcrypt for password hashing
const jwt = require('jsonwebtoken'); // JWT for token generation and verification
const { sendEmailWithSES } = require('../helper/emailService'); // Email sending function using AWS SES
const { 
  registerValidationSchema, 
  loginValidationSchema, 
  forgotPasswordValidationSchema, 
  resetPasswordValidationSchema 
} = require('../helper/validation'); // Validation schemas for input validation
const { getUserByEmail, createUser, updateUserPassword } = require('../helper/queries'); // Database query functions

// Initialize the Express router
const router = express.Router();

// POST /register - Endpoint to handle user registration
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  // Validate input data against the registration schema
  const { error } = registerValidationSchema.validate({ email, username, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message }); // Return validation error message
  }

  try {
    // Check if the user already exists in the database
    const existingUser = await getUserByEmail(email);
    if (existingUser.Item) {
      return res.status(400).json({ error: 'User with this email already exists' }); // Return error if user exists
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, username, password: hashedPassword };

    // Save the new user to the database
    await createUser(newUser);
    res.status(201).json({ message: 'User registered successfully' }); // Return success message
  } catch (err) {
    console.error('Error registering user:', err); // Log error for debugging
    res.status(500).json({ error: 'Internal Server Error' }); // Return server error response
  }
});

// POST /login - Endpoint to handle user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input data against the login schema
  const { error } = loginValidationSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message }); // Return validation error message
  }

  try {
    // Retrieve the user from the database
    const user = await getUserByEmail(email);
    if (!user.Item) {
      return res.status(400).json({ error: 'Invalid credentials' }); // Return error if user not found
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.Item.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' }); // Return error if passwords don't match
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ email: user.Item.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token }); // Return the token in the response
  } catch (err) {
    console.error('Error logging in user:', err); // Log error for debugging
    res.status(500).json({ error: 'Internal Server Error' }); // Return server error response
  }
});

// POST /forgot-password - Endpoint to handle forgot password requests
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Validate the email format using the validation schema
  const { error } = forgotPasswordValidationSchema.validate({ email });
  if (error) {
    return res.status(400).json({ error: error.details[0].message }); // Return validation error message
  }

  try {
    // Retrieve the user from the database
    const user = await getUserByEmail(email);
    if (!user.Item) {
      return res.status(400).json({ error: 'No user found with this email address' }); // Return error if user not found
    }

    // Generate a password reset token
    const token = jwt.sign({ email: user.Item.email }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Send the reset email using AWS SES
    await sendEmailWithSES(email, token);

    res.status(200).json({
      message: 'Password reset link sent to your email', // Success message
      token: token, // Optional: Include the token in the response (for testing purposes)
    });
  } catch (err) {
    console.error('Error sending reset email:', err); // Log error for debugging
    res.status(500).json({ error: 'Internal Server Error' }); // Return server error response
  }
});

// POST /reset-password - Endpoint to handle password reset
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  // Validate the new password using the validation schema
  const { error } = resetPasswordValidationSchema.validate({ newPassword });
  if (error) {
    return res.status(400).json({ error: error.details[0].message }); // Return validation error message
  }

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve the user from the database
    const user = await getUserByEmail(decoded.email);
    if (!user.Item) {
      return res.status(400).json({ error: 'Invalid reset token' }); // Return error if token is invalid
    }

    // Hash the new password for security
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await updateUserPassword(decoded.email, hashedPassword);

    res.status(200).json({ message: 'Password reset successfully' }); // Return success message
  } catch (err) {
    console.error('Error resetting password:', err); // Log error for debugging
    res.status(500).json({ error: 'Internal Server Error' }); // Return server error response
  }
});

// Export the router to be used in the application
module.exports = router;
