// Import Joi library
// Joi is a powerful library used for schema description and data validation
const Joi = require('joi');

// Define the validation schema for user registration
// Ensures that the email is valid, the username has 3-30 characters, and the password has at least 6 characters
const registerValidationSchema = Joi.object({
  email: Joi.string().email().required(), // Email must be a valid email format and is required
  username: Joi.string().min(3).max(30).required(), // Username must be between 3 and 30 characters and is required
  password: Joi.string().min(6).required(), // Password must be at least 6 characters and is required
});

// Define the validation schema for user login
// Ensures that the email and password are provided and meet basic requirements
const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(), // Email must be a valid email format and is required
  password: Joi.string().min(6).required(), // Password must be at least 6 characters and is required
});

// Define the validation schema for forgot password functionality
// Ensures that the email is valid and required for initiating the password reset process
const forgotPasswordValidationSchema = Joi.object({
  email: Joi.string().email().required(), // Email must be a valid email format and is required
});

// Define the validation schema for resetting the password
// Ensures that the new password is provided and meets the minimum length requirement
const resetPasswordValidationSchema = Joi.object({
  newPassword: Joi.string().min(6).required(), // New password must be at least 6 characters and is required
});

// Export the schemas for use in other parts of the application
module.exports = {
  registerValidationSchema, // Validation schema for user registration
  loginValidationSchema, // Validation schema for user login
  forgotPasswordValidationSchema, // Validation schema for forgot password
  resetPasswordValidationSchema, // Validation schema for resetting the password
};
