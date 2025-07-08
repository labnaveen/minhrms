//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('reporting_manager_employee_association', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'user', key: 'id'}
            },
            reporting_role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'reporting_role', key: 'id'}
            },
            reporting_manager_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'reporting_managers', key: 'id'}
            },
            created_at:{
                type: DataTypes.DATE
            },
            updated_at:{
                type: DataTypes.DATE
            }
        })
    },
    down: async({context: queryInterface}) => {
        await queryInterface.dropTable('reporting_manager_employee_association')
    }
}