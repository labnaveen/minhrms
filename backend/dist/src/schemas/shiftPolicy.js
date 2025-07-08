"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftPolicyUpdationSchema = exports.ShiftPolicyCreation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ShiftPolicyCreation = joi_1.default.object({
    shift_name: joi_1.default.string().required(),
    shift_description: joi_1.default.string().optional(),
    notes_for_punch: joi_1.default.boolean().optional(),
    allow_single_punch: joi_1.default.boolean().optional(),
    shift_type_id: joi_1.default.number(),
    shift_start_time: joi_1.default.when('shift_type_id', { is: 1, then: joi_1.default.string().required(), otherwise: joi_1.default.optional() }).optional(),
    shift_end_time: joi_1.default.when('shift_type_id', { is: 1, then: joi_1.default.string().required(), otherwise: joi_1.default.optional() }).optional(),
    pre_shift_duration: joi_1.default.when('shift_type_id', { is: 1, then: joi_1.default.number(), otherwise: joi_1.default.optional() }).optional(),
    post_shift_duration: joi_1.default.when('shift_type_id', { is: 1, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    consider_breaks: joi_1.default.boolean(),
    break_duration: joi_1.default.when('consider_breaks', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    break_start_time: joi_1.default.when('consider_breaks', { is: true, then: joi_1.default.string().required(), otherwise: joi_1.default.optional() }).optional(),
    break_end_time: joi_1.default.when('consider_breaks', { is: true, then: joi_1.default.string().required(), otherwise: joi_1.default.optional() }).optional(),
    enable_grace: joi_1.default.boolean(),
    grace_duration_allowed: joi_1.default.when('enable_grace', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    number_of_days_grace_allowed: joi_1.default.when('enable_grace', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    status_grace_exceeded: joi_1.default.when('enable_grace', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    enable_grace_recurring: joi_1.default.when('enable_grace', { is: true, then: joi_1.default.boolean().optional(), otherwise: joi_1.default.optional() }).optional(),
    enable_flex: joi_1.default.when('shift_type_id', { is: 1, then: joi_1.default.boolean(), otherwise: joi_1.default.optional() }).optional(),
    flex_start_time: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    flexi_duration_allowed: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    number_of_days_flexi_allowed: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    status_flexi_exceeded: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    status_punch_in_time_exceeded: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    enable_flex_recurring: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.boolean(), otherwise: joi_1.default.boolean() }).optional(),
    base_working_hours: joi_1.default.when('shift_type_id', { is: 2, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() })
});
exports.ShiftPolicyUpdationSchema = joi_1.default.object({
    shift_name: joi_1.default.string().required(),
    shift_description: joi_1.default.string().optional(),
    notes_for_punch: joi_1.default.boolean().optional(),
    allow_single_punch: joi_1.default.boolean().optional(),
    shift_type_id: joi_1.default.number(),
    shift_start_time: joi_1.default.when('shift_type_id', { is: 1, then: joi_1.default.string().required(), otherwise: joi_1.default.optional() }).optional(),
    shift_end_time: joi_1.default.when('shift_type_id', { is: 1, then: joi_1.default.string().required(), otherwise: joi_1.default.optional() }).optional(),
    pre_shift_duration: joi_1.default.when('shift_type_id', { is: 1, then: joi_1.default.number(), otherwise: joi_1.default.optional() }).optional(),
    post_shift_duration: joi_1.default.when('shift_type_id', { is: 1, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    consider_breaks: joi_1.default.boolean(),
    break_duration: joi_1.default.when('consider_breaks', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    break_start_time: joi_1.default.when('consider_breaks', { is: true, then: joi_1.default.string().required(), otherwise: joi_1.default.optional() }).optional(),
    break_end_time: joi_1.default.when('consider_breaks', { is: true, then: joi_1.default.string().required(), otherwise: joi_1.default.optional() }).optional(),
    enable_grace: joi_1.default.boolean(),
    grace_duration_allowed: joi_1.default.when('enable_grace', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    number_of_days_grace_allowed: joi_1.default.when('enable_grace', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    status_grace_exceeded: joi_1.default.when('enable_grace', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    enable_grace_recurring: joi_1.default.when('enable_grace', { is: true, then: joi_1.default.boolean().optional(), otherwise: joi_1.default.optional() }).optional(),
    enable_flex: joi_1.default.when('shift_type_id', { is: 1, then: joi_1.default.boolean(), otherwise: joi_1.default.optional() }).optional(),
    flex_start_time: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    flexi_duration_allowed: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    number_of_days_flexi_allowed: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    status_flexi_exceeded: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    status_punch_in_time_exceeded: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.number().required(), otherwise: joi_1.default.optional() }).optional(),
    enable_flex_recurring: joi_1.default.when('enable_flex', { is: true, then: joi_1.default.boolean(), otherwise: joi_1.default.boolean() }).optional(),
    base_working_hours: joi_1.default.when('shift_type_id', { is: 2, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() })
});
