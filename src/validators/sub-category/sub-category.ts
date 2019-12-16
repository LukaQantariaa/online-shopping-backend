import * as Joi from '@hapi/joi'

export const SubCategory = Joi.object({
    name: Joi.string()
        .min(3)
        .max(32)
        .required(),
    CategoryId: Joi.number()
        .required(),
    is_active: Joi.boolean()
        .required()
})
