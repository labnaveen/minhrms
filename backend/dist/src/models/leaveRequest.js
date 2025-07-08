"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class LeaveRequest extends sequelize_1.Model {
}
;
LeaveRequest.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    leave_record_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'leave_record', key: 'id' }
    },
    reporting_manager_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'reporting_managers', key: 'id' }
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'approval_status', key: 'id' },
        defaultValue: 1
    },
    priority: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: db_1.sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'leave_request',
    modelName: 'leave_request'
});
exports.default = LeaveRequest;
