"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const ApiError_1 = require("./ApiError.");
const notFound = (message) => {
    return (0, ApiError_1.apiError)(404, message);
};
exports.notFound = notFound;
