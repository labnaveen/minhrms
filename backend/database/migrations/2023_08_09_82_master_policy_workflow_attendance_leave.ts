//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.renameColumn('master_policy', 'leave_policy_id', 'base_leave_configuration_id');
        await queryInterface.addColumn('master_policy', 'shift_policy_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
        });
        await queryInterface.addColumn('master_policy', 'leave_workflow', {
            type: DataTypes.INTEGER,
            allowNull: false,
        });
        await queryInterface.addColumn('master_policy', 'attendance_workflow', {
            type: DataTypes.INTEGER,
            allowNull: false,
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.renameColumn('master_policy', 'base_leave_configuration_id', 'leave_policy_id');
        await queryInterface.removeColumn('master_policy', 'shift_policy_id');
        await queryInterface.removeColumn('master_policy', 'leave_workflow');
        await queryInterface.removeColumn('master_policy', 'attendance_workflow');
    }
}