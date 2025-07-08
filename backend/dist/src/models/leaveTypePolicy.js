"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const accrual_1 = __importDefault(require("./dropdown/type/accrual"));
const accrualFrequency_1 = __importDefault(require("./dropdown/frequency/accrualFrequency"));
const accrualFrom_1 = __importDefault(require("./dropdown/chronology/accrualFrom"));
const leaveType_1 = __importDefault(require("./leaveType"));
class LeaveTypePolicy extends sequelize_1.Model {
}
;
LeaveTypePolicy.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    leave_type_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: leaveType_1.default, key: 'id' }
    },
    leave_policy_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    accrual_frequency: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: accrualFrequency_1.default, key: 'id' }
    },
    accrual_type: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: accrual_1.default, key: 'id' }
    },
    accrual_from: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: accrualFrom_1.default, key: 'id' }
    },
    accrual_from_custom_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    advance_accrual_for_entire_leave_year: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    annual_eligibility: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    annual_breakup: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'leave_type_policy',
    modelName: 'leave_type_policy'
});
exports.default = LeaveTypePolicy;
