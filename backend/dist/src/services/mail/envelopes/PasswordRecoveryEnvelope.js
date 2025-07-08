"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const pug_1 = __importDefault(require("pug"));
const { FRONTEND_PASSWORD_RECOVERY_URL } = process.env;
class PasswordRecoveryEnvelope {
    constructor(recoveryToken, verificationCode) {
        this.subject = 'Vidhyasaga password recovery';
        const link = FRONTEND_PASSWORD_RECOVERY_URL.replace('@@token', recoveryToken).replace('@@code', verificationCode);
        this.html = pug_1.default.renderFile(path_1.default.join(__dirname, 'PasswordRecoveryEnvelope.pug'), { link });
    }
}
exports.default = PasswordRecoveryEnvelope;
