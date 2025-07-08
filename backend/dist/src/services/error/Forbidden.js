"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forbiddenError = void 0;
const ApiError_1 = require("./ApiError.");
const forbiddenError = (message) => {
    return (0, ApiError_1.apiError)(403, message);
};
exports.forbiddenError = forbiddenError;
