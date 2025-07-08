"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const pug_1 = __importDefault(require("pug"));
const { FRONTEND_EMAIL_VERIFICATION_URL } = process.env;
class VerificationEnvelope {
    constructor(claimToken) {
        this.subject = 'Please verify your email address';
        const link = FRONTEND_EMAIL_VERIFICATION_URL.replace('@@token', claimToken);
        this.html = pug_1.default.renderFile(path_1.default.join(__dirname, 'VerificationEnvelope.pug'), { link });
    }
}
exports.default = VerificationEnvelope;
