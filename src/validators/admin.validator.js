import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[A-Za-z\\d!@#$%^&*]{8,}$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().required(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[A-Za-z\\d!@#$%^&*]{8,}$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
    }),
});

export const getUsersScehma = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10)
});

export const searchUsersScehma = Joi.object({
  searchTerm: Joi.string().trim().min(1).required(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10)
});

export const revealPasswordSchema = Joi.object({
  userId: Joi.string().length(24).hex().required()
})

export const createUserSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  dob: Joi.date().required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  country: Joi.string().trim().required(),
  shares: Joi.number().min(0).required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[A-Za-z\\d!@#$%^&*]{8,}$'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.',
    }),
});

export const updateUserSchema = Joi.object({
  userId: Joi.string().length(24).hex().required(),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  dob: Joi.date().optional(),
  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  country: Joi.string().trim().optional(),
  shares: Joi.number().min(0).optional(),

  email: Joi.any().forbidden().messages({ 'any.unknown': 'Email cannot be updated' }),
  password: Joi.any().forbidden().messages({ 'any.unknown': 'Password cannot be updated' })
});

export const userIdSchemaParams = Joi.object({
  id: Joi.string().length(24).hex().required()
});

export const updateKlarnaPriceSchema = Joi.object({ 
  newklarnaPrice: Joi.number().min(0).required() 
});