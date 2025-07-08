//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('master_policy', {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            policy_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            policy_description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            attendance_policy_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {model: 'attendance_policy', key: 'id'}
            },
            leave_policy_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_deleted:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
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
        await queryInterface.dropTable('master_policy')
    }
}