//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.changeColumn("master_policy", "profile_change_workflow", {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {model: 'approval_flow', key: 'id'}
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.changeColumn("master_policy", "profile_change_workflow");
    }
}