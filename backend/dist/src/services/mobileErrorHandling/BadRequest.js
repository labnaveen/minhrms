"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequest = void 0;
const ApiError_1 = require("./ApiError.");
const badRequest = (success, message) => {
    return (0, ApiError_1.apiError)(200, success, message);
};
exports.badRequest = badRequest;
