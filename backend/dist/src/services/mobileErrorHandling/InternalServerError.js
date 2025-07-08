"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalServerError = void 0;
const ApiError_1 = require("./ApiError.");
const internalServerError = (success, message) => {
    return (0, ApiError_1.apiError)(500, success, message);
};
exports.internalServerError = internalServerError;
