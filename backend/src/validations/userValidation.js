const Joi = require("joi");

const registerUserSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required(),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  password: Joi.string()
    .min(8)
    .max(128)
    .required(),

  phoneNumber: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required(),

  role: Joi.string()
    .valid("candidate", "recruiter")
    .default("candidate"),
});

const loginUserSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  password: Joi.string()
    .min(8)
    .max(128)
    .required(),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
};