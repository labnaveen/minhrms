"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const baseLeaveConfiguration_1 = __importDefault(require("./baseLeaveConfiguration"));
const shiftPolicy_1 = __importDefault(require("./shiftPolicy"));
const approvalFlow_1 = __importDefault(require("./approvalFlow"));
const weeklyOffPolicy_1 = __importDefault(require("./weeklyOffPolicy"));
const holidayCalendar_1 = __importDefault(require("./holidayCalendar"));
class MasterPolicy extends sequelize_1.Model {
}
MasterPolicy.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    policy_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    policy_description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    attendance_policy_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'attendance_policy', key: 'id' }
    },
    base_leave_configuration_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: baseLeaveConfiguration_1.default, key: 'id' }
    },
    shift_policy_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: shiftPolicy_1.default, key: 'id' }
    },
    weekly_off_policy_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: weeklyOffPolicy_1.default, key: 'id' }
    },
    holiday_calendar_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: holidayCalendar_1.default, key: 'id' }
    },
    leave_workflow: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: approvalFlow_1.default, key: 'id' }
    },
    attendance_workflow: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: approvalFlow_1.default, key: 'id' }
    },
    expense_workflow: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: approvalFlow_1.default, key: 'id' }
    },
    profile_change_workflow: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: { model: approvalFlow_1.default, key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'master_policy',
    modelName: 'master_policy'
});
exports.default = MasterPolicy;
