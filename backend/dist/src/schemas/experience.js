"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceCreationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.ExperienceCreationSchema = joi_1.default.object({
    company_name: joi_1.default.string().required().example('A-36'),
    designation: joi_1.default.string().required(),
    employment_type_id: joi_1.default.number().required(),
    start_date: joi_1.default.date().required(),
    end_date: joi_1.default.date().required(),
    address: joi_1.default.string().required()
});
