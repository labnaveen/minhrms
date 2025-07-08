"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamilyMemberUpdationSchema = exports.FamilyMemberCreationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.FamilyMemberCreationSchema = joi_1.default.object({
    name: joi_1.default.string().required().example('Rajeev'),
    dob: joi_1.default.date().required().example('07-12-1956'),
    relation_id: joi_1.default.number().required().example(1),
    occupation: joi_1.default.string().optional(),
    phone: joi_1.default.string().optional(),
    email: joi_1.default.string().optional()
});
exports.FamilyMemberUpdationSchema = joi_1.default.object({
    name: joi_1.default.string().required().example('Rajeev'),
    dob: joi_1.default.date().required().example('07-12-1956'),
    relation_id: joi_1.default.number().required().example(1),
    occupation: joi_1.default.string().optional(),
    phone: joi_1.default.string().optional(),
    email: joi_1.default.string().optional()
});
