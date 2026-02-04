import Joi from "joi";

// Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character from !@#$%^&*
export const signupSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[A-Za-z\\d!@#$%^&*]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Das Passwort muss mindestens 8 Zeichen lang sein, mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen aus !@#$%^&* enthalten.",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().required(),
});

// Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character from !@#$%^&*
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[A-Za-z\\d!@#$%^&*]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Das Passwort muss mindestens 8 Zeichen lang sein, mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen aus !@#$%^&* enthalten.",
    }),
});

export const getUsersScehma = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).default(10),
});

export const searchUsersScehma = Joi.object({
  searchTerm: Joi.string().trim().min(0).allow("").required(),
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
});

export const revealPasswordSchema = Joi.object({
  userId: Joi.string().length(24).hex().required(),
});

// Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character from !@#$%^&*
export const createUserSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  dob: Joi.date().required(),
  gender: Joi.string().valid("Männlich", "Weiblich", "Divers").required(),
  country: Joi.string().trim().required(),
  shares: Joi.number().min(0).required(),
  klarnaPurchasePrice: Joi.number().min(0).required(),
  klarnaPrice: Joi.number().min(0).required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[A-Za-z\\d!@#$%^&*]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Das Passwort muss mindestens 8 Zeichen lang sein, mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen aus !@#$%^&* enthalten.",
    }),
});

// Email cannot be updated
// Password cannot be updated
// At least one field to update must be provided

export const updateUserSchema = Joi.object({
  userId: Joi.string().length(24).hex().required(),

  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  dob: Joi.date().optional(),
  gender: Joi.string().valid("Männlich", "Weiblich", "Divers").optional(),
  country: Joi.string().trim().optional(),
  shares: Joi.number().min(0).optional(),
  klarnaPurchasePrice: Joi.number().min(0).required(),
  klarnaPrice: Joi.number().min(0).required(),
  email: Joi.any().forbidden().messages({
    "any.unknown": "Die E-Mail-Adresse kann nicht aktualisiert werden.",
  }),
  password: Joi.any().forbidden().messages({
    "any.unknown": "Das Passwort kann nicht aktualisiert werden.",
  }),
})
  .or(
    "firstName",
    "lastName",
    "dob",
    "gender",
    "country",
    "shares",
    "klarnaPurchasePrice"
  ) // Requires at least one
  .messages({
    "object.missing":
      "Es muss mindestens ein Feld zum Aktualisieren angegeben werden.",
  });

export const userIdSchemaParams = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const updateKlarnaPriceSchema = Joi.object({
  newKlarnaPrice: Joi.number().min(0).required(),
});

export const deleteUsersSchema = Joi.object({
  userIds: Joi.array().items(Joi.string().length(24).hex()).min(1).required(),
});

export const createTagesgeldSchema = Joi.object({
  bank: Joi.string().trim().required().messages({
    "string.empty": "Bank ist erforderlich",
    "any.required": "Bank ist erforderlich"
  }),
  laufzeit: Joi.string().trim().required().messages({
    "string.empty": "Laufzeit ist erforderlich",
    "any.required": "Laufzeit ist erforderlich"
  }),
  betrag: Joi.string().trim().required().messages({
    "string.empty": "Betrag ist erforderlich",
    "any.required": "Betrag ist erforderlich"
  }),
  zinsatz: Joi.string().trim().required().messages({
    "string.empty": "Zinsatz ist erforderlich",
    "any.required": "Zinsatz ist erforderlich"
  })
});

export const updateTagesgeldSchema = Joi.object({
  bank: Joi.string().trim().required().messages({
    "string.empty": "Bank ist erforderlich",
    "any.required": "Bank ist erforderlich"
  }),
  laufzeit: Joi.string().trim().required().messages({
    "string.empty": "Laufzeit ist erforderlich",
    "any.required": "Laufzeit ist erforderlich"
  }),
  betrag: Joi.string().trim().required().messages({
    "string.empty": "Betrag ist erforderlich",
    "any.required": "Betrag ist erforderlich"
  }),
  zinsatz: Joi.string().trim().required().messages({
    "string.empty": "Zinsatz ist erforderlich",
    "any.required": "Zinsatz ist erforderlich"
  })
});
