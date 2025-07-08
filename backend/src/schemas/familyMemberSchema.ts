import Joi from "joi";

export const FamilyMemberCreationSchema = Joi.object({
    name: Joi.string().required().example('Rajeev'),
    dob: Joi.date().required().example('07-12-1956'),
    relation_id: Joi.number().required().example(1),
    occupation: Joi.string().optional(),
    phone: Joi.string().optional(),
    email: Joi.string().optional()
})

export const FamilyMemberUpdationSchema = Joi.object({
    name: Joi.string().required().example('Rajeev'),
    dob: Joi.date().required().example('07-12-1956'),
    relation_id: Joi.number().required().example(1),
    occupation: Joi.string().optional(),
    phone: Joi.string().optional(),
    email: Joi.string().optional()
})