const Joi = require('joi');

const registerValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const forgotPasswordValidationSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordValidationSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
});

module.exports = {
  registerValidationSchema,
  loginValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
