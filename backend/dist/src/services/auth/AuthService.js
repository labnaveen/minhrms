"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScope = exports.sendVerificationToken = exports.verify = exports.refresh = exports.authorize = void 0;
//@ts-nocheck
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../../models");
const Redis_1 = __importDefault(require("../cache/Redis"));
const PermissionService_1 = require("./PermissionService");
const response_1 = require("../response/response");
const uuid_1 = require("uuid");
const { NODE_ENV, JWT_SECRET } = process.env;
function getJWTExpireTime() {
    switch (NODE_ENV) {
        case 'development':
            return '1y';
        case 'testing':
            return '24h';
        default:
            return '12h';
    }
}
const scopeCache = new Redis_1.default('scope');
const SCOPE_CACHE_EXPIRES_IN_SECONDS = 600;
async function authorize(user) {
    const scope = await (0, PermissionService_1.getUserRoles)(user.role_id);
    const session_id = (0, uuid_1.v4)();
    console.log(">>>>>>>>>>SESSION", session_id);
    const token = jsonwebtoken_1.default.sign({
        company_id: user.company_id,
        employee_id: user.id,
        session_id: session_id,
        tokenType: 'access'
    }, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '15m'
    });
    const refresh = jsonwebtoken_1.default.sign({
        company_id: user.company_id,
        employee_id: user.id,
        session_id: session_id,
        tokenType: 'refresh',
    }, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '15d',
    });
    const refreshData = {
        user_id: user.id,
        session_id: session_id,
        refresh_token: refresh,
        fcm_token: user.fcm_token ? user.fcm_token : null,
        device_id: user.device_id ? user.device_id : null
    };
    const newRefreshEntry = await models_1.Refresh.create(refreshData);
    const userResponse = {
        id: user.id,
        company_id: user.company_id,
        employee_name: user.employee_name,
        employee_generated_id: user.employee_generated_id,
        date_of_joining: user.date_of_joining,
        probation_period: user.probation_period,
        probation_due_date: user.probation_due_date,
        work_location: user.work_location,
        leve: user.level,
        grade: user.grade,
        cost_center: user.cost_center,
        employee_official_email: user.employee_official_email,
        employee_personal_email: user.employee_personal_email,
        dob_adhaar: user.dob_adhaar,
        dob_celebrated: user.dob_celebrated,
        employee_gender_id: user.employee_gender_id,
        is_deleted: user.is_deleted,
        role_id: user.role_id,
        status: user.status,
        companyId: user.companyId,
        password_changed: user.password_changed
    };
    const responseData = {
        userResponse,
        scope,
        token,
        refresh,
        fcm_token: newRefreshEntry.fcm_token,
        device_id: newRefreshEntry.device_id
    };
    const response = (0, response_1.generateResponse)(200, true, "User logged In Succesfully", responseData);
    return {
        response
    };
}
exports.authorize = authorize;
function refresh(token) {
    const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    if (typeof payload !== 'object') {
        throw new Error('JWT payload is not an object');
    }
    const objectPayload = payload;
    if (!objectPayload.tokenType) {
        throw new Error('Malformed JWT payload');
    }
    return objectPayload;
}
exports.refresh = refresh;
async function verify(toVerify) {
    const { company_id, tokenType } = toVerify;
    const company = models_1.Company.findByPk(company_id);
    if (tokenType !== 'access' || !company) {
        return { isValid: false };
    }
    // let scope: string[] | null = await getScope(user, scopeKey)
    // if(!scope){
    // 	scope = await getUserRoles(user.id)
    // }
    return { isValid: true, credentials: { company_id, tokenType } };
}
exports.verify = verify;
async function sendVerificationToken(user) {
    return { name: user.employee_name, email: '' };
}
exports.sendVerificationToken = sendVerificationToken;
// export async function secureScope(user: User, scope: string[], hashKey?: string):Promise<string>{
// 	const scopeKey = hashKey || cryptoRandomString({length: 10, type: 'alphanumeric'})
// 	const serializedScope = serializeScope(scope)
// 	await scopeCache.set(`${user.id}:${scopeKey}`, await serializedScope, SCOPE_CACHE_EXPIRES_IN_SECONDS)
// 	return scopeKey
// }
async function getScope(user, scopeKey) {
    const serializedScope = await scopeCache.get(`${user.id}:${scopeKey}`);
    if (!serializedScope) {
        return null;
    }
    return (serializedScope);
}
exports.getScope = getScope;
// export async function serializeScope(scope: string[]): Promise<string>{
// 	return zlib.brotliCompressSync(JSON.stringify(scope)).toString('base64')
// }
// export async function deserializeScope(serializedScope: string): Promise<string[]>{
// 	return JSON.parse(zlib.brotliDecompressSync(Buffer.from(serializedScope, 'base64')).toString('utf-8')) as string[]
// }
