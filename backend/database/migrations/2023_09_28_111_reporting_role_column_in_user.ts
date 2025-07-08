//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.addColumn("user", "reporting_role_id", {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {model: 'reporting_role', key: 'id'}
        }),
        await queryInterface.addColumn("user", "reporting_manager_id", {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {model: 'reporting_managers', key: 'id'}
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.deleteColumn("user", "reporting_role_id");
        await queryInterface.deleteColumn("user", "reporting_manager_id");
    }
}