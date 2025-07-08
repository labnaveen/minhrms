"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponse = void 0;
const generateResponse = (status, success, message, data, meta) => ({
    status: status,
    success: success,
    data: data,
    meta: meta,
    message: message
});
exports.generateResponse = generateResponse;
