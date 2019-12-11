import * as Joi from '@hapi/joi'

export const userSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(16)
        .required(),
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
        .required(),
    password: Joi.string()
        .min(6)
        .max(128)
        .required(),
    is_active: Joi.boolean()
        .required()
})