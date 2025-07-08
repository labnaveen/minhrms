"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const attendancePolicy_1 = __importDefault(require("./attendancePolicy"));
const attendanceStatus_1 = __importDefault(require("./attendanceStatus"));
class RegularisationStatusAttendancePolicy extends sequelize_1.Model {
}
;
RegularisationStatusAttendancePolicy.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    attendance_policy_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: attendancePolicy_1.default, key: 'id' }
    },
    regularisation_status_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: attendanceStatus_1.default, key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'regularisation_status_attendance_policy',
    modelName: 'regularisation_status_attendance_policy'
});
exports.default = RegularisationStatusAttendancePolicy;
