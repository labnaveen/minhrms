"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiError = void 0;
const apiError = (code, message) => ({
    code,
    message,
    name: 'ApiError'
});
exports.apiError = apiError;
