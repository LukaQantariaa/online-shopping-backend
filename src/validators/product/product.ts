import * as Joi from '@hapi/joi'

export const ProductSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(32)
        .required(),
    description: Joi.string()
        .min(3)
        .required(),
    price: Joi.number()
        .required(),
    location: Joi.string()
        .min(3)
        .max(32)
        .required(),
    SubCategoryId: Joi.number()
        .required(),
    UserId: Joi.number()
        .required(),
    is_active: Joi.boolean()
        .required()
})
