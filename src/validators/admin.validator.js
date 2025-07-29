import Joi from "joi";

export const adminSignupSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[A-Za-z\\d!@#$%^&*]{8,}$'))
      .required()
      .messages({
        'string.pattern.base':
          'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
      }),
});

export const adminLoginSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().required(),
});