"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorized = void 0;
const ApiError_1 = require("./ApiError.");
const unauthorized = (message) => {
    return (0, ApiError_1.apiError)(401, message);
};
exports.unauthorized = unauthorized;
