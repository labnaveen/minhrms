"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomHoliday = exports.HolidayCalendarCreationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.HolidayCalendarCreationSchema = joi_1.default.object({
    name: joi_1.default.string().trim().min(1).required(),
    year: joi_1.default.string().trim().min(1).required(),
    holiday_id: joi_1.default.array().items(joi_1.default.number().optional()).optional()
});
exports.UpdateCustomHoliday = joi_1.default.object({
    name: joi_1.default.string().trim().min(1).optional(),
    date: joi_1.default.date().optional(),
    custom_holiday: joi_1.default.boolean().optional(),
    holiday_calendar_id: joi_1.default.number().required()
});
