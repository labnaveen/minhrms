"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.removeConstraint("approval_flow_reporting_role_undirect", "approval_flow_reporting_role_undirect_ibfk_4");
        await queryInterface.changeColumn("approval_flow_reporting_role_undirect", "reporting_role_id", {
            type: sequelize_1.DataTypes.INTEGER,
            references: { model: 'user', key: 'id' }
        });
        await queryInterface.renameColumn("approval_flow_reporting_role_undirect", "reporting_role_id", "supervisor_role_id");
        await queryInterface.renameTable("approval_flow_reporting_role_undirect", "approval_flow_supervisor_indirect");
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.addConstraint("approval_flow_reporting_role_undirect", "approval_flow_reporting_role_undirect_ibfk_4");
        await queryInterface.changeColumn("approval_flow_reporting_role_undirect", "reporting_role_id", {
            type: sequelize_1.DataTypes.INTEGER,
            references: { model: 'reporting_role', key: 'id' }
        });
        await queryInterface.renameColumn("approval_flow_reporting_role_undirect", "supervisor_role_id", "reporting_role_id");
        await queryInterface.renameTable("approval_flow_supervisor_indirect", "approval_flow_reporting_role_undirect");
    },
};
