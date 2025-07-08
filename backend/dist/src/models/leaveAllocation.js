"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const leaveTypePolicy_1 = __importDefault(require("./leaveTypePolicy"));
const months_1 = __importDefault(require("./dropdown/chronology/months"));
const db_1 = require("../utilities/db");
class LeaveAllocation extends sequelize_1.Model {
}
;
LeaveAllocation.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    leave_type_policy_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: leaveTypePolicy_1.default, key: 'id' }
    },
    month_number: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: months_1.default, key: 'id' }
    },
    allocated_leaves: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'leave_allocation',
    modelName: 'leave_allocation'
});
exports.default = LeaveAllocation;
