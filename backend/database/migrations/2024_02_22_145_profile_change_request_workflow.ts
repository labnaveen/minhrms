//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("master_policy", "profile_change_workflow", {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {model: 'approval_flow', key: 'id'}
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("master_policy", "profile_change_workflow");
    }
}