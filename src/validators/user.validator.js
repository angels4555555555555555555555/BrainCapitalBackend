import Joi from "joi";

export const userLoginSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().required(),
});