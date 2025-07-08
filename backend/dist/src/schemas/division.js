"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DivisionUnitUpdateSchema = exports.DivisionUnitCreationSchema = exports.DivisionCreationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.DivisionCreationSchema = joi_1.default.object({
    division_name: joi_1.default.string().required(),
    division_units: joi_1.default.array().items(joi_1.default.string()).optional()
});
exports.DivisionUnitCreationSchema = joi_1.default.object({
    units: joi_1.default.array().items(joi_1.default.string()).optional(),
    division_id: joi_1.default.number().required()
});
exports.DivisionUnitUpdateSchema = joi_1.default.object({
    unit_name: joi_1.default.string().required()
});
