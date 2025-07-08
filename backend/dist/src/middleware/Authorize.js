"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorize = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const config_1 = require("../utilities/config");
const models_1 = require("../models");
const PermissionService_1 = require("../services/auth/PermissionService");
const Unauthorized_1 = require("../services/error/Unauthorized");
const Forbidden_1 = require("../services/error/Forbidden");
const InternalServerError_1 = require("../services/error/InternalServerError");
const Authorize = (permission) => async (req, res, next) => {
    try {
        // console.log(permission)
        const token = req.headers.authorization?.split(' ')[1];
        // const token = req.headers.authorization
        if (!token) {
            // return res.status(401).json("The token is missing!")
            return next((0, Unauthorized_1.unauthorized)("The token is missing!"));
        }
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
            const userId = decoded.employee_id;
            const sessionId = decoded.session_id;
            const employee = await models_1.User.findOne({
                where: { id: userId }
            });
            const scope = await (0, PermissionService_1.getUserRoles)(employee?.role_id);
            const obj = scope.permissions.find((item) => item.name === permission);
            if (decoded) {
                if (obj !== undefined) {
                    //@ts-ignore
                    req.credentials = { id: userId };
                    //@ts-ignore
                    req.session = { session_id: sessionId };
                    return next();
                }
                else {
                    // return res.status(403).json("You don't have permission to access this resource.")
                    next((0, Forbidden_1.forbiddenError)("You don't have permission to access this resource."));
                }
            }
            else {
                // return res.status(401).json('Invalid or expired token! Please login again.')
                next((0, Unauthorized_1.unauthorized)("Invalid or expired token! Please login again."));
            }
        }
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            next((0, Unauthorized_1.unauthorized)(err.message));
        }
        else {
            next((0, InternalServerError_1.internalServerError)("Something Went Wrong!"));
            // res.status(500).json(err)
        }
    }
};
exports.Authorize = Authorize;
