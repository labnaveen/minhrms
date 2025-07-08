"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("./user"));
const db_1 = require("../utilities/db");
const approval_1 = __importDefault(require("./dropdown/status/approval"));
const leaveType_1 = __importDefault(require("./leaveType"));
const dayType_1 = __importDefault(require("./dropdown/dayType/dayType"));
const halfDayType_1 = __importDefault(require("./dropdown/dayType/halfDayType"));
class LeaveRecord extends sequelize_1.Model {
}
LeaveRecord.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    leave_type_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: leaveType_1.default, key: 'id' }
    },
    day_type_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: dayType_1.default, key: 'id' }
    },
    half_day_type_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: { model: halfDayType_1.default, key: 'id' }
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: user_1.default, key: 'id' }
    },
    start_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    reason: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    document: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    contact_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: { model: approval_1.default, key: 'id' }
    },
    reject_reason: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    last_action_by: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: { model: user_1.default, key: 'id' }
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'leave_record',
    tableName: 'leave_record'
});
exports.default = LeaveRecord;
