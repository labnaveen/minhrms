//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("master_policy", "weekly_off_policy_id", {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: 'weekly_off_policy', key: 'id'}
        }),
        await queryInterface.addColumn("master_policy", "holiday_calendar_id", {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: 'holiday_calendar', key: 'id'}
        }),
        await queryInterface.addColumn("master_policy", "expense_workflow", {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: 'approval_flow', key: 'id'}
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("master_policy", "weekly_off_policy_id");
        await queryInterface.deleteColumn("master_policy", "holiday_calendar_id");
        await queryInterface.deleteColumn("master_policy", "expense_workflow");
    }
}