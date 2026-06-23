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

const festgeldSchema = Joi.object({
  bank: Joi.string().trim().allow("").optional(),
  betrag: Joi.number().min(0).allow("").optional(),
  zinsen: Joi.number().min(0).allow("").optional(),
  laufzeit: Joi.string().trim().allow("").optional(),
});

const tagesgeldSchema = Joi.object({
  bank: Joi.string().trim().allow("").optional(),
  betrag: Joi.number().min(0).allow("").optional(),
  zinsen: Joi.number().min(0).allow("").optional(),
  garantierteZinslaufzeit: Joi.string().trim().allow("").optional(),
});

const openAISchema = Joi.object({
  anzahl: Joi.number().min(0).allow("").optional(),
  gekaufterWert: Joi.number().min(0).allow("").optional(),
  aktuellerWert: Joi.number().min(0).allow("").optional(),
  investition: Joi.number().min(0).allow("").optional(),
  aktuellerGewinn: Joi.number().allow("").optional(),
  depotWert: Joi.number().min(0).allow("").optional(),
});

const productsSchema = Joi.array()
  .items(Joi.string().valid("festgeld", "tagesgeld", "openAI"))
  .min(1)
  .unique();

const requiredProductFields = {
  festgeld: ["bank", "betrag", "zinsen", "laufzeit"],
  tagesgeld: ["bank", "betrag", "zinsen", "garantierteZinslaufzeit"],
  openAI: ["anzahl", "gekaufterWert", "aktuellerWert", "investition", "aktuellerGewinn", "depotWert"],
};

const validateSelectedProductDetails = (value, helpers) => {
  if (!value.products) return value;
  for (const product of value.products) {
    const details = value[product];
    for (const field of requiredProductFields[product]) {
      if (details?.[field] === undefined || details?.[field] === null || details?.[field] === "") {
        return helpers.error("any.custom", {
          message: `Für ${product} ist das Feld ${field} erforderlich.`,
        });
      }
    }
  }
  return value;
};

// Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character from !@#$%^&*
export const createUserSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  dob: Joi.date().required(),
  gender: Joi.string().valid("Männlich", "Weiblich", "Divers").required(),
  country: Joi.string().trim().required(),
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
  products: productsSchema.required(),
  festgeld: festgeldSchema.optional(),
  tagesgeld: tagesgeldSchema.optional(),
  openAI: openAISchema.optional(),
})
  .custom(validateSelectedProductDetails)
  .messages({ "any.custom": "{{#message}}" });

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
  products: productsSchema.optional(),
  festgeld: festgeldSchema.optional(),
  tagesgeld: tagesgeldSchema.optional(),
  openAI: openAISchema.optional(),
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
    "products",
    "festgeld",
    "tagesgeld",
    "openAI"
  ) // Requires at least one
  .messages({
    "object.missing":
      "Es muss mindestens ein Feld zum Aktualisieren angegeben werden.",
    "any.custom": "{{#message}}",
  })
  .custom(validateSelectedProductDetails);

export const userIdSchemaParams = Joi.object({
  id: Joi.string().length(24).hex().required(),
});

export const deleteUsersSchema = Joi.object({
  userIds: Joi.array().items(Joi.string().length(24).hex()).min(1).required(),
});
