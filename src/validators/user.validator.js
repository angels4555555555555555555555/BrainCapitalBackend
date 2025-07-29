import Joi from "joi";

export const userSignupSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    dob: Joi.date().required(),
    gender: Joi.string().valid("Male", "Female", "Other").required(),
    country: Joi.string().trim().required(),
    shares: Joi.number().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[A-Za-z\\d!@#$%^&*]{8,}$'))
      .required()
      .messages({
        'string.pattern.base':
          'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
      }),
});

export const userLoginSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().required(),
});