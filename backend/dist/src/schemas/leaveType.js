"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveTypeUpdationSchema = exports.LeaveTypeCreationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.LeaveTypeCreationSchema = joi_1.default.object({
    leave_type_name: joi_1.default.string().required(),
    negative_balance: joi_1.default.boolean(),
    max_leave_allowed_in_negative_balance: joi_1.default.when('negative_balance', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number() }),
    max_days_per_leave: joi_1.default.number().required(),
    max_days_per_month: joi_1.default.number().required(),
    allow_half_days: joi_1.default.boolean(),
    leave_application_after: joi_1.default.number().required(),
    custom_leave_application_date: joi_1.default.when('leave_application_after', { is: 3, then: joi_1.default.date().required(), otherwise: joi_1.default.date().optional() }).optional(),
    application_on_holidays: joi_1.default.boolean(),
    restriction_for_application: joi_1.default.boolean().required(),
    limit_back_dated_application: joi_1.default.when('restriction_for_application', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    notice_for_application: joi_1.default.when('restriction_for_application', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    auto_approval: joi_1.default.boolean().required(),
    auto_action_after: joi_1.default.when('auto_approval', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    auto_approval_action: joi_1.default.when('auto_approval', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    supporting_document_mandatory: joi_1.default.boolean(),
    prorated_accrual_first_month: joi_1.default.boolean(),
    prorated_rounding: joi_1.default.when('prorated_accrural_first_month', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    prorated_rounding_factor: joi_1.default.when('prorated_accrural_first_month', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    encashment_yearly: joi_1.default.boolean(),
    max_leaves_for_encashment: joi_1.default.when('encashment_yearly', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    carry_forward_yearly: joi_1.default.boolean(),
    carry_forward_rounding: joi_1.default.when('carry_forward_yearly', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    carry_forward_rounding_factor: joi_1.default.when('carry_forward_yearly', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    intra_cycle_carry_forward: joi_1.default.boolean(),
    prefix_postfix_weekly_off_sandwhich_rule: joi_1.default.boolean(),
    prefix_postfix_holiday_sandwhich_rule: joi_1.default.boolean(),
    inbetween_weekly_off_sandwhich_rule: joi_1.default.boolean(),
    inbetween_holiday_sandwhich_rule: joi_1.default.boolean()
});
exports.LeaveTypeUpdationSchema = joi_1.default.object({
    leave_type_name: joi_1.default.string().optional(),
    negative_balance: joi_1.default.boolean(),
    max_leave_allowed_in_negative_balance: joi_1.default.when('negative_balance', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number() }),
    max_days_per_leave: joi_1.default.number().optional(),
    max_days_per_month: joi_1.default.number().optional(),
    allow_half_days: joi_1.default.boolean(),
    leave_application_after: joi_1.default.number().optional(),
    custom_leave_application_date: joi_1.default.when('leave_application_after', { is: 3, then: joi_1.default.date().required(), otherwise: joi_1.default.date().optional() }).optional(),
    application_on_holidays: joi_1.default.boolean(),
    restriction_for_application: joi_1.default.boolean().optional(),
    limit_back_dated_application: joi_1.default.when('restriction_for_application', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    notice_for_application: joi_1.default.when('restriction_for_application', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    auto_approval: joi_1.default.boolean().optional(),
    auto_action_after: joi_1.default.when('auto_approval', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    auto_approval_action: joi_1.default.when('auto_approval', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    supporting_document_mandatory: joi_1.default.boolean(),
    prorated_accrual_first_month: joi_1.default.boolean(),
    prorated_rounding: joi_1.default.when('prorated_accrural_first_month', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    prorated_rounding_factor: joi_1.default.when('prorated_accrural_first_month', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    encashment_yearly: joi_1.default.boolean(),
    max_leaves_for_encashment: joi_1.default.when('encashment_yearly', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    carry_forward_yearly: joi_1.default.boolean(),
    carry_forward_rounding: joi_1.default.when('carry_forward_yearly', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    carry_forward_rounding_factor: joi_1.default.when('carry_forward_yearly', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    intra_cycle_carry_forward: joi_1.default.boolean(),
    prefix_postfix_weekly_off_sandwhich_rule: joi_1.default.boolean(),
    prefix_postfix_holiday_sandwhich_rule: joi_1.default.boolean(),
    inbetween_weekly_off_sandwhich_rule: joi_1.default.boolean(),
    inbetween_holiday_sandwhich_rule: joi_1.default.boolean()
});
