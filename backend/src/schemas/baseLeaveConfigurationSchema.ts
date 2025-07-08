import Joi from "joi";

export const BaseLeaveConfigurationCreationSchema = Joi.object({
    policy_name: Joi.string().required(),
    policy_description: Joi.string().optional(),
    leave_calendar_from: Joi.number().required(), 
    custom_month: Joi.when('leave_calendar_from', {is: 3, then: Joi.number().required(), otherwise: Joi.number().optional()}).optional(),
    leave_request_status: Joi.boolean().optional(),
    proxy_leave_application: Joi.boolean().optional(),
    leave_balance_status: Joi.boolean().optional(),
    contact_number_allowed: Joi.boolean().optional(),
    contact_number_mandatory: Joi.boolean().optional(),
    reason_for_leave: Joi.boolean().optional(),
    reason_for_leave_mandatory: Joi.boolean().optional(),
    notify_peer: Joi.boolean().optional(),
    notify_peer_mandatory: Joi.boolean().optional(),
    leave_rejection_reason: Joi.boolean().optional()
})