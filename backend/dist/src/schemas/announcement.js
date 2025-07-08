"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementCreationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.AnnouncementCreationSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    suspendable: joi_1.default.boolean().optional(),
    group_specific: joi_1.default.boolean().optional(),
    start_date: joi_1.default.when('suspendable', { is: true, then: joi_1.default.date().required(), otherwise: joi_1.default.date().optional() }).optional(),
    end_date: joi_1.default.when('suspendable', { is: true, then: joi_1.default.date().required(), otherwise: joi_1.default.date().optional() }).optional(),
    description: joi_1.default.string().optional(),
    units: joi_1.default.array().items(joi_1.default.number()).optional()
});
