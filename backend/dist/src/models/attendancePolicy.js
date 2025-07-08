"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const attendanceStatus_1 = __importDefault(require("./attendanceStatus"));
const day_of_month_1 = __importDefault(require("./dropdown/chronology/day_of_month"));
class AttendancePolicy extends sequelize_1.Model {
}
;
AttendancePolicy.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    // working_hours:{
    //     type: DataTypes.FLOAT,
    //     allowNull: false
    // },
    attendance_cycle_start: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: day_of_month_1.default, key: 'id' },
        allowNull: false,
        defaultValue: 1
    },
    biometric: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    web: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    app: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    manual: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    default_attendance_status: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: attendanceStatus_1.default, key: 'id' },
        defaultValue: 1
    },
    // overtime_rule:{
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
    // regularisation_status:{
    //     type: DataTypes.STRING,
    //     allowNull: false,
    // },
    half_day: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    min_hours_for_half_day: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    display_overtime_hours: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_deficit_hours: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_late_mark: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_average_working_hours: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_present_number_of_days: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_absent_number_of_days: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_number_of_leaves_taken: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_average_in_time: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    display_average_out_time: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    flexibility_hours: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    call_out_regularisation: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    round_off: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    auto_approval_attendance_request: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    regularisation_restriction: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    regularisation_restriction_limit: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    regularisation_limit_for_month: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    bypass_regularisation_proxy: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    location_based_restriction: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    location_mandatory: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    location: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    distance_allowed: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    mobile_app_restriction: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    number_of_devices_allowed: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'attendance_policy',
    modelName: 'attendance_policy'
});
exports.default = AttendancePolicy;
