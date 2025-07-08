"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseLeaveConfigurationCreationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.BaseLeaveConfigurationCreationSchema = joi_1.default.object({
    policy_name: joi_1.default.string().required(),
    policy_description: joi_1.default.string().optional(),
    leave_calendar_from: joi_1.default.number().required(),
    custom_month: joi_1.default.when('leave_calendar_from', { is: 3, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    leave_request_status: joi_1.default.boolean().optional(),
    proxy_leave_application: joi_1.default.boolean().optional(),
    leave_balance_status: joi_1.default.boolean().optional(),
    contact_number_allowed: joi_1.default.boolean().optional(),
    contact_number_mandatory: joi_1.default.boolean().optional(),
    reason_for_leave: joi_1.default.boolean().optional(),
    reason_for_leave_mandatory: joi_1.default.boolean().optional(),
    notify_peer: joi_1.default.boolean().optional(),
    notify_peer_mandatory: joi_1.default.boolean().optional(),
    leave_rejection_reason: joi_1.default.boolean().optional()
});
