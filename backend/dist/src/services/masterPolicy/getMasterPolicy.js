"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMasterPolicy = void 0;
const models_1 = require("../../models");
const masterPolicy_1 = __importDefault(require("../../models/masterPolicy"));
const attendancePolicy_1 = __importDefault(require("../../models/attendancePolicy"));
const approvalFlow_1 = __importDefault(require("../../models/approvalFlow"));
const leaveTypePolicy_1 = __importDefault(require("../../models/leaveTypePolicy"));
const getMasterPolicy = async (id) => {
    try {
        const user = await models_1.User.findByPk(id);
        const masterPolicyId = user?.master_policy_id;
        const masterPolicy = await masterPolicy_1.default.findByPk(masterPolicyId, {
            include: [
                {
                    model: attendancePolicy_1.default
                },
                {
                    model: approvalFlow_1.default,
                    as: 'attendanceWorkflow'
                },
                {
                    model: approvalFlow_1.default,
                    as: 'leaveWorkflow'
                },
                {
                    model: approvalFlow_1.default,
                    as: 'profileChangeWorkflow'
                },
                // {
                //     model: ApprovalFlow,
                //     as: 'approvalWorkflow'
                // },
                {
                    model: leaveTypePolicy_1.default,
                    as: 'LeaveTypePolicies',
                    attributes: ['id', 'leave_policy_name', 'description'],
                    include: [
                        { model: models_1.LeaveType, attributes: ['id', 'leave_type_name', 'allow_half_days'] }
                    ],
                    through: {
                        attributes: []
                    }
                }
            ]
        });
        if (masterPolicy) {
            return masterPolicy;
        }
        else {
            return new Error("Cannot find a master policy");
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.getMasterPolicy = getMasterPolicy;
