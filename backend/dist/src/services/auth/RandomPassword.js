"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = void 0;
function generatePassword() {
    let length = 8, charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", password = "";
    for (let i = 0; i < length; ++i) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    return password;
}
exports.generatePassword = generatePassword;
