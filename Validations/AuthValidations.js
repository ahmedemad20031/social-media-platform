const Joi = require("joi");

const registerValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8),
});

const verfiyValidation = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

const recentpassword = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  password: Joi.string().required(),
});
const forgetPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
});
const recentotpValidation = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  registerValidation,
  loginValidation,
  verfiyValidation,
  recentpassword,
  forgetPasswordValidation,
  recentotpValidation,
};
