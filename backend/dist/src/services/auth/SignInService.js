"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.mobileEmailSignInProcess = exports.emailSignInProcess = void 0;
const models_1 = require("../../models");
const authenticate_1 = require("../../utilities/authenticate");
const AuthService_1 = require("./AuthService");
async function emailSignInProcess(email, password) {
    const user = await models_1.User.findOne({ where: { employee_official_email: email } });
    if (!user) {
        // throw new Error('User Does Not Exist')
        return { code: 401, message: 'User Does Not Exist' };
    }
    if (!user.status) {
        // throw new Error('User Not Active')
        return { code: 401, message: 'User is not Active' };
    }
    const isValid = await (0, authenticate_1.authenticate)(user, password);
    if (!isValid) {
        // throw new Error('Invalid Credentials')
        return { code: 401, message: 'Invalid Credentials' };
    }
    if (isValid) {
        return (0, AuthService_1.authorize)(user);
    }
}
exports.emailSignInProcess = emailSignInProcess;
async function mobileEmailSignInProcess(email, password, fcm_token, device_id) {
    const user = await models_1.User.findOne({ where: { employee_official_email: email } });
    if (!user) {
        // throw new Error('User Does Not Exist')
        return { code: 401, message: 'User Does Not Exist' };
    }
    if (!user.status) {
        // throw new Error('User Not Active')
        return { code: 401, message: 'User is not Active' };
    }
    const isValid = await (0, authenticate_1.authenticate)(user, password);
    if (!isValid) {
        // throw new Error('Invalid Credentials')
        return { code: 401, message: 'Invalid Credentials' };
    }
    if (isValid) {
        user.fcm_token = fcm_token;
        user.device_id = device_id;
        return (0, AuthService_1.authorize)(user);
    }
}
exports.mobileEmailSignInProcess = mobileEmailSignInProcess;
async function refresh(refreshToken) {
    let decoded;
    try {
        decoded = refresh(refreshToken);
    }
    catch (_err) {
        const err = _err;
        throw new Error(err.message);
    }
    const { 
    //@ts-ignore
    user: { id: userId }, 
    //@ts-ignore
    tokenType } = decoded;
    if (tokenType !== 'refresh') {
        throw new Error('Only refresh tokens are accepted');
    }
    const user = await models_1.User.findByPk(userId);
    if (!user) {
        throw new Error('User not found');
    }
    //@ts-ignore
    return (0, AuthService_1.authorize)(user);
}
exports.refresh = refresh;
