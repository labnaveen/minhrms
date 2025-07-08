"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("approval_flow_reporting_role_undirect", "approval_flow_id", {
            type: sequelize_1.DataTypes.INTEGER,
            references: { model: 'approval_flow', key: 'id' }
        });
        await queryInterface.changeColumn("approval_flow_reporting_role_undirect", "reporting_role_id", {
            type: sequelize_1.DataTypes.INTEGER,
            references: { model: 'reporting_role', key: 'id' }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("approval_flow_reporting_role_undirect", "approval_flow_id", {
            type: sequelize_1.DataTypes.INTEGER,
            references: { model: 'approval_flow_reporting_role', key: 'id' }
        });
        await queryInterface.changeColumn("approval_flow_reporting_role_undirect", "reporting_role_id", {
            type: sequelize_1.DataTypes.INTEGER,
            references: { model: 'approval_flow_reporting_role', key: 'id' }
        });
    },
};
