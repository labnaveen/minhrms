"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
async function authenticate(user, password) {
    //@ts-ignore
    const userPassword = user.employee_password;
    console.log(userPassword);
    if (!userPassword) {
        return false;
    }
    const validPassword = await bcrypt_1.default.compare(password, userPassword);
    if (!validPassword) {
        return false;
    }
    if (validPassword) {
        return true;
    }
}
exports.authenticate = authenticate;
