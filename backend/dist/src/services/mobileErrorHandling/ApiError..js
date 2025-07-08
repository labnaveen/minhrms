"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiError = void 0;
const apiError = (status, success, message) => ({
    status,
    success,
    message,
    name: 'MobileApiError'
});
exports.apiError = apiError;
