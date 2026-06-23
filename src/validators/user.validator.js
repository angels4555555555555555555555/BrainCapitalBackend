import Joi from "joi";

export const userLoginSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().required(),
});

export const userUpdatePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
        .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\\d)[A-Za-z\\d!@#$%^&*]{8,}$"))
        .required()
        .messages({
            "string.pattern.base": "Das Passwort muss mindestens 8 Zeichen lang sein, mindestens einen Großbuchstaben, eine Zahl und ein Sonderzeichen aus !@#$%^&* enthalten.",
        }),
});
