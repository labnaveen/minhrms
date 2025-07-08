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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = require("../../../src/services/auth/AuthService");
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const mocha_1 = require("mocha");
const PermissionService = __importStar(require("../../../src/services/auth/PermissionService"));
(0, mocha_1.describe)('Authorize Function', () => {
    (0, mocha_1.it)('should return an object existing of user, scope, token, and refresh token.', async () => {
        const user = {
            id: 1,
            company_id: 1,
            employee_name: 'Anugrah Bhatt',
            employee_generated_id: 'GV-123',
            date_of_joining: '2023-04-03',
            probation_period: '6 months',
            probation_due_date: '2023-10-03',
            designation: 'Software Engineer',
            department: 'IT',
            work_location: 'office',
            level: '',
            grade: '',
            cost_center: '',
            employee_official_email: 'anugrah.bhatt@glocalview.com',
            employee_personal_email: 'bhattanugrah@gmail.com',
            dob_adhaar: '1998-04-01',
            dob_celebrated: '1998-04-01',
            employee_gender_id: 1,
            is_deleted: false,
            role_id: 1,
            status: true,
            employee_password: '$2a$10$pq45/XqbKBMxmyQyL4l73.nc0ClLAtDaxQCn0UOuccNf/gZkB6Uc.'
        };
        const scope = { "scope": {
                "id": 1,
                "name": "Admin",
                "alias": "admin",
                "description": "This role is for the main super HR",
                "status": true,
                "createdAt": "2023-03-23T19:53:50.000Z",
                "updatedAt": "2023-03-23T19:53:50.000Z",
                "permissions": [
                    {
                        "id": 1,
                        "name": "permissions.list"
                    },
                    {
                        "id": 2,
                        "name": "permissions.create"
                    },
                    {
                        "id": 3,
                        "name": "permissions.show"
                    },
                    {
                        "id": 4,
                        "name": "permissions.update"
                    },
                    {
                        "id": 5,
                        "name": "permissions.destroy"
                    },
                    {
                        "id": 6,
                        "name": "permissions.status"
                    },
                    {
                        "id": 7,
                        "name": "users.list"
                    },
                    {
                        "id": 8,
                        "name": "users.create"
                    },
                    {
                        "id": 9,
                        "name": "users.show"
                    },
                    {
                        "id": 10,
                        "name": "users.update"
                    },
                    {
                        "id": 11,
                        "name": "users.destroy"
                    },
                    {
                        "id": 12,
                        "name": "users.status"
                    },
                    {
                        "id": 13,
                        "name": "roles.list"
                    },
                    {
                        "id": 14,
                        "name": "roles.create"
                    },
                    {
                        "id": 15,
                        "name": "roles.show"
                    },
                    {
                        "id": 16,
                        "name": "roles.update"
                    },
                    {
                        "id": 17,
                        "name": "roles.destroy"
                    },
                    {
                        "id": 18,
                        "name": "roles.status"
                    }
                ]
            } };
        const getUserRolesFake = sinon_1.default.stub().resolves(scope);
        sinon_1.default.replace(PermissionService, 'getUserRoles', getUserRolesFake);
        const authData = await (0, AuthService_1.authorize)(user);
        (0, chai_1.expect)(authData.user).to.deep.equal(user);
        (0, chai_1.expect)(authData.scope).to.deep.equal(scope);
        (0, chai_1.expect)(authData.token).to.be.a('string');
        (0, chai_1.expect)(authData.refresh).to.be.a('string');
    });
});
