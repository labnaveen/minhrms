"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterPolicyCreationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.MasterPolicyCreationSchema = joi_1.default.object({
    policy_name: joi_1.default.string().required(),
    policy_description: joi_1.default.string().optional(),
    attendance_policy_id: joi_1.default.number().required(),
    base_leave_configuration_id: joi_1.default.number().required(),
    shift_policy_id: joi_1.default.number().required(),
    leave_workflow_id: joi_1.default.number().required(),
    attendance_workflow_id: joi_1.default.number().required(),
    expense_workflow_id: joi_1.default.number().required(),
    leave_type_policies: joi_1.default.array().optional(),
    weekly_off_policy_id: joi_1.default.number().required(),
    holiday_calendar_id: joi_1.default.number().required(),
    profile_change_workflow_id: joi_1.default.number().required()
});
