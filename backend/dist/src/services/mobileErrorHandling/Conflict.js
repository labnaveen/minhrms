"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conflict = void 0;
const ApiError_1 = require("./ApiError.");
const conflict = (succuss, message) => {
    return (0, ApiError_1.apiError)(409, succuss, message);
};
exports.conflict = conflict;
