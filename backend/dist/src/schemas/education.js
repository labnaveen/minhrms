"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationUpdationSchema = exports.EducationCreationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.EducationCreationSchema = joi_1.default.object({
    institution_name: joi_1.default.string().required(),
    degree_id: joi_1.default.number().required(),
    course_name: joi_1.default.string().optional(),
    field_of_study: joi_1.default.string().optional(),
    year_of_completion: joi_1.default.number().required(),
    percentage: joi_1.default.number().optional()
});
exports.EducationUpdationSchema = joi_1.default.object({
    institution_name: joi_1.default.string().optional(),
    degree_id: joi_1.default.number().optional(),
    course_name: joi_1.default.string().optional(),
    field_of_study: joi_1.default.string().optional(),
    year_of_completion: joi_1.default.number().optional(),
    percentage: joi_1.default.number().optional()
});
