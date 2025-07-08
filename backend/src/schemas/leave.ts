import Joi from "joi";


export const LeaveCreationSchema = Joi.object({
    leave_type_id: Joi.number().required(),
    day_type_id: Joi.number().required(),
    half_day_type_id: Joi.when('day_type_id', {is: 1, then: Joi.number().required(), otherwise: Joi.number().optional()}).optional(),
    start_date: Joi.when('day_type_id', {is: 2, then: Joi.date().required(), otherwise: Joi.date().optional()}).optional(),
    end_date: Joi.when('day_type_id', {is: 2, then: Joi.date().required(), otherwise: Joi.date().optional()}).optional(),
    contact_number: Joi.number().optional(),
    reason: Joi.string().optional()
});


export const LeaveUpdationSchema = Joi.object({
    leave_type_id: Joi.number().required(),
    day_type_id: Joi.number().required(),
    half_day_type_id: Joi.when('day_type_id', {is: 1, then: Joi.number().required(), otherwise: Joi.number().optional()}).optional(),
    start_date: Joi.when('day_type_id', {is: 2, then: Joi.date().required(), otherwise: Joi.date().optional()}).optional(),
    end_date: Joi.when('day_type_id', {is: 2, then: Joi.date().required(), otherwise: Joi.date().optional()}).optional(),
    contact_number: Joi.number().optional(),
    reason: Joi.string().optional()
});

export const ManualLeaveCreationSchema = Joi.object({
    leave_balance: Joi.object().pattern(Joi.string().required(), Joi.number().required().required())
})