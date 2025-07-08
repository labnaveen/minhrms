import Joi from "joi";



export const HolidayCalendarCreationSchema = Joi.object({
    name: Joi.string().trim().min(1).required(),
    year: Joi.string().trim().min(1).required(),
    holiday_id: Joi.array().items(Joi.number().optional()).optional()
})


export const UpdateCustomHoliday = Joi.object({
    name: Joi.string().trim().min(1).optional(),
    date: Joi.date().optional(),
    custom_holiday: Joi.boolean().optional(),
    holiday_calendar_id: Joi.number().required()

})
