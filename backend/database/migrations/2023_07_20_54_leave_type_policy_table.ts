//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('leave_type_policy', {
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            leave_policy_name:{
                type: DataTypes.STRING,
                allowNull: false
            },
            description:{
                type: DataTypes.STRING,
                allowNull: true
            },
            accrural_frequency:{
                type: DataTypes.INTEGER,
            },
            accrural_type:{
                type: DataTypes.INTEGER,
            },
            accrural_from:{
                type: DataTypes.INTEGER,
            },
            advance_accrual_for_entire_leave_year:{
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            annual_eligibility:{
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            annual_breakup: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
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
        await queryInterface.dropTable('leave_type_policy')
    }
}