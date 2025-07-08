//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('base_leave_configuration', {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            policy_name:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            policy_description:{
                type: DataTypes.TEXT,
                allowNull: true
            },
            leave_calendar_from:{
                type: DataTypes.INTEGER,
                allowNull: false
            },
            proxy_leave_by:{
                type: DataTypes.INTEGER,
                allowNull: true
            },
            leave_request_status:{
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            leave_balance_status:{
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            contact_number_allowed:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            contact_number_mandatory:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            reason_for_leave:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            reason_for_leave_mandatory:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            notify_peer:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            leave_rejection_reason:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
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
        await queryInterface.dropTable('base_leave_configuration')
    }
}