"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class ApprovalFlowReportingRole extends sequelize_1.Model {
}
ApprovalFlowReportingRole.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
    approval_flow_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'approval_flow', key: 'id' }
    },
    reporting_role_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'reporting_role', key: 'id' }
    },
}, {
    sequelize: db_1.sequelize,
    timestamps: true,
    underscored: true,
    tableName: 'approval_flow_reporting_role',
    modelName: 'approval_flow_reporting_role'
});
exports.default = ApprovalFlowReportingRole;
