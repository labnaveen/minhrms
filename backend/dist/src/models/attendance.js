"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const user_1 = __importDefault(require("./user"));
const attendanceStatus_1 = __importDefault(require("./attendanceStatus"));
class Attendance extends sequelize_1.Model {
}
;
Attendance.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: user_1.default, key: 'id' }
    },
    employee_generated_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    punch_in_time: {
        type: sequelize_1.DataTypes.TIME,
    },
    punch_out_time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1,
        references: { model: attendanceStatus_1.default, key: 'id' }
    },
    flexi_used: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    grace_used: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    flexi_counter: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    },
    grace_counter: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'attendance',
    modelName: 'attendance'
});
exports.default = Attendance;
