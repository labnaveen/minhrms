import Joi, { string } from "joi";


export const DivisionCreationSchema = Joi.object({
    division_name: Joi.string().required(),
    division_units: Joi.array().items(Joi.string()).optional()
})


export const DivisionUnitCreationSchema = Joi.object({
    units:  Joi.array().items(Joi.string()).optional(),
    division_id: Joi.number().required()
})


export const DivisionUnitUpdateSchema = Joi.object({
    unit_name: Joi.string().required()
})