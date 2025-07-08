"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualLeaveCreationSchema = exports.LeaveUpdationSchema = exports.LeaveCreationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.LeaveCreationSchema = joi_1.default.object({
    leave_type_id: joi_1.default.number().required(),
    day_type_id: joi_1.default.number().required(),
    half_day_type_id: joi_1.default.when('day_type_id', { is: 1, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    start_date: joi_1.default.when('day_type_id', { is: 2, then: joi_1.default.date().required(), otherwise: joi_1.default.date().optional() }).optional(),
    end_date: joi_1.default.when('day_type_id', { is: 2, then: joi_1.default.date().required(), otherwise: joi_1.default.date().optional() }).optional(),
    contact_number: joi_1.default.number().optional(),
    reason: joi_1.default.string().optional()
});
exports.LeaveUpdationSchema = joi_1.default.object({
    leave_type_id: joi_1.default.number().required(),
    day_type_id: joi_1.default.number().required(),
    half_day_type_id: joi_1.default.when('day_type_id', { is: 1, then: joi_1.default.number().required(), otherwise: joi_1.default.number().optional() }).optional(),
    start_date: joi_1.default.when('day_type_id', { is: 2, then: joi_1.default.date().required(), otherwise: joi_1.default.date().optional() }).optional(),
    end_date: joi_1.default.when('day_type_id', { is: 2, then: joi_1.default.date().required(), otherwise: joi_1.default.date().optional() }).optional(),
    contact_number: joi_1.default.number().optional(),
    reason: joi_1.default.string().optional()
});
exports.ManualLeaveCreationSchema = joi_1.default.object({
    leave_balance: joi_1.default.object().pattern(joi_1.default.string().required(), joi_1.default.number().required().required())
});
