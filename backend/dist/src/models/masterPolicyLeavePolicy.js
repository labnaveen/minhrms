"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const sequelize_typescript_1 = require("sequelize-typescript");
const masterPolicy_1 = __importDefault(require("./masterPolicy"));
const leaveType_1 = __importDefault(require("./leaveType"));
const leaveTypePolicy_1 = __importDefault(require("./leaveTypePolicy"));
class MasterPolicyLeavePolicy extends sequelize_1.Model {
}
;
MasterPolicyLeavePolicy.init({
    id: {
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    master_policy_id: {
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        references: { model: masterPolicy_1.default, key: 'id' }
    },
    leave_type_id: {
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        references: { model: leaveType_1.default, key: 'id' }
    },
    leave_type_policy_id: {
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        references: { model: leaveTypePolicy_1.default, key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'master_policy_leave_policy',
    modelName: 'master_policy_leave_policy'
});
exports.default = MasterPolicyLeavePolicy;
