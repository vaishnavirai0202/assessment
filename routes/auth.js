const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmailWithSES } = require('../helper/emailService');
const { 
  registerValidationSchema, 
  loginValidationSchema, 
  forgotPasswordValidationSchema, 
  resetPasswordValidationSchema 
} = require('../helper/validation');
const { getUserByEmail, createUser, updateUserPassword } = require('../helper/queries');

const router = express.Router();

// POST /register
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  const { error } = registerValidationSchema.validate({ email, username, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser.Item) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, username, password: hashedPassword };

    await createUser(newUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginValidationSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user.Item) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.Item.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.Item.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    // Validate email format
    const { error } = forgotPasswordValidationSchema.validate({ email });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    try {
      const user = await getUserByEmail(email);
      if (!user.Item) {
        return res.status(400).json({ error: 'No user found with this email address' });
      }
  
      const token = jwt.sign({ email: user.Item.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      await sendEmailWithSES(email, token); // Use the SES service to send email
  
      res.status(200).json({
        message: 'Password reset link sent to your email',
        token: token,  // Send the reset token in the response
      });
    } catch (err) {
      console.error('Error sending reset email:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// POST /reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  const { error } = resetPasswordValidationSchema.validate({ newPassword });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getUserByEmail(decoded.email);
    if (!user.Item) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(decoded.email, hashedPassword);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
