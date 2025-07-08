import Joi from "joi";


export const ExperienceCreationSchema = Joi.object({
    company_name: Joi.string().required().example('A-36'),
    designation: Joi.string().required(),
    employment_type_id: Joi.number().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    address: Joi.string().required()  
})