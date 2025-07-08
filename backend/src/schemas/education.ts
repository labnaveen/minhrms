import Joi from "joi";



export const EducationCreationSchema = Joi.object({
    institution_name: Joi.string().required(),
    degree_id: Joi.number().required(),
    course_name: Joi.string().optional(),
    field_of_study: Joi.string().optional(),
    year_of_completion: Joi.number().required(),
    percentage: Joi.number().optional()
})


export const EducationUpdationSchema = Joi.object({
    institution_name: Joi.string().optional(),
    degree_id: Joi.number().optional(),
    course_name: Joi.string().optional(),
    field_of_study: Joi.string().optional(),
    year_of_completion: Joi.number().optional(),
    percentage: Joi.number().optional()
})