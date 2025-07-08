"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const ApiError_1 = require("./ApiError.");
const notFound = (success, message) => {
    return (0, ApiError_1.apiError)(200, success, message);
};
exports.notFound = notFound;
