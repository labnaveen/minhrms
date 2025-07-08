"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn('master_policy', 'leave_policy_id', 'base_leave_configuration_id');
        await queryInterface.addColumn('master_policy', 'shift_policy_id', {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        });
        await queryInterface.addColumn('master_policy', 'leave_workflow', {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        });
        await queryInterface.addColumn('master_policy', 'attendance_workflow', {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn('master_policy', 'base_leave_configuration_id', 'leave_policy_id');
        await queryInterface.removeColumn('master_policy', 'shift_policy_id');
        await queryInterface.removeColumn('master_policy', 'leave_workflow');
        await queryInterface.removeColumn('master_policy', 'attendance_workflow');
    }
};
