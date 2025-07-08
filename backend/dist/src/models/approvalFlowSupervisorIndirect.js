"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../utilities/db");
class ApprovalFlowSupervisorIndirect extends sequelize_1.Model {
}
ApprovalFlowSupervisorIndirect.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    approval_flow_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'approval_flow', key: 'id' }
    },
    supervisor_role_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'user', key: 'id' }
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'approval_flow_supervisor_indirect',
    tableName: 'approval_flow_supervisor_indirect'
});
exports.default = ApprovalFlowSupervisorIndirect;
