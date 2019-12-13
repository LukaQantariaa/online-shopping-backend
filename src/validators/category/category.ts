import * as Joi from '@hapi/joi'

export const Category = Joi.object({
    name: Joi.string()
        .min(3)
        .max(32)
        .required(),
    is_active: Joi.boolean()
        .required()
})
