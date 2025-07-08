import Joi from "joi";



export const MasterPolicyCreationSchema = Joi.object({
    policy_name: Joi.string().required(),
    policy_description: Joi.string().optional(),
    attendance_policy_id: Joi.number().required(),
    base_leave_configuration_id: Joi.number().required(),
    shift_policy_id: Joi.number().required(),
    leave_workflow_id: Joi.number().required(),
    attendance_workflow_id: Joi.number().required(),
    expense_workflow_id: Joi.number().required(),
    leave_type_policies: Joi.array().optional(),
    weekly_off_policy_id: Joi.number().required(),
    holiday_calendar_id: Joi.number().required(),
    profile_change_workflow_id: Joi.number().required()
})