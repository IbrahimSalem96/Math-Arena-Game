const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  username: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };
