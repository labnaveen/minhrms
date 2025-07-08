//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('master_policy_leave_policy', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            master_policy_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'master_policy', key: 'id'}
            },
            leave_type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'leave_type', key: 'id'}
            },
            leave_type_policy_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'leave_type_policy', key: 'id'}
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
        await queryInterface.dropTable('master_policy_leave_policy')
    }
}