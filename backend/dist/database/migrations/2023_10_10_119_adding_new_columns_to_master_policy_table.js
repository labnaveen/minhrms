"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("master_policy", "weekly_off_policy_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'weekly_off_policy', key: 'id' }
        }),
            await queryInterface.addColumn("master_policy", "holiday_calendar_id", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'holiday_calendar', key: 'id' }
            }),
            await queryInterface.addColumn("master_policy", "expense_workflow", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'approval_flow', key: 'id' }
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("master_policy", "weekly_off_policy_id");
        await queryInterface.deleteColumn("master_policy", "holiday_calendar_id");
        await queryInterface.deleteColumn("master_policy", "expense_workflow");
    }
};
