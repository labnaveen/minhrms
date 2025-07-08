"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
const attendanceStatus_1 = __importDefault(require("./attendanceStatus"));
const approval_1 = __importDefault(require("./dropdown/status/approval"));
class RegularizationRecord extends sequelize_1.Model {
}
RegularizationRecord.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' }
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false
    },
    in_time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false
    },
    out_time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false
    },
    request_status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: attendanceStatus_1.default, key: 'id' }
    },
    reason: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: { model: approval_1.default, key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    tableName: 'regularization_record',
    modelName: 'regularization_record'
});
exports.default = RegularizationRecord;
