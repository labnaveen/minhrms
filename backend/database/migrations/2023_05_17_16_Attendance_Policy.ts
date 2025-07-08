//@ts-nocheck
import { DataTypes } from "sequelize";


module.exports = {
    up: async({context: queryInterface}) => {
        await queryInterface.createTable('attendance_policy', {
            id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            description:{
                type: DataTypes.STRING,
                allowNull: true
            },
            name:{
                type: DataTypes.TEXT,
                allowNull: false
            },
            attendance_cycle_start:{
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            biometric:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            web:{
                type:DataTypes.BOOLEAN,
                defaultValue: false
            },
            app:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            manual:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            // default_attendance_status:{
            //     type: DataTypes.STRING,
            //     references: {model: AttendanceStatus, key: 'id'},
            //     defaultValue: 'absent'
            // },
            // overtime_rule:{
            //     type: DataTypes.STRING,
            //     allowNull: true,
            // },
            regularisation_status:{
                type: DataTypes.STRING
            },
            half_day:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            hours_half_day:{
                type: DataTypes.INTEGER,
            },
            display_overtime_hours:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_deficit_hours:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_late_mark:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_average_working_hours:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_present_number_of_days:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_absent_number_of_days:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_number_of_leaves_taken:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_average_in_time:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_average_out_time:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            flexibility_hours:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            call_out_regularisation:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            round_off:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            auto_approval_attendance_request:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            regularisation_restriction:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            regularisation_restriction_limit:{
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            regularisation_limit_for_month:{
                type: DataTypes.INTEGER,   
            },
            bypass_regularisation_proxy:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            location_based_restriction:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            location_mandatory:{
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            location: {
                type: DataTypes.STRING,
            },
            distance_allowed:{
                type: DataTypes.STRING,
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
        await queryInterface.dropTable('attendance_policy')
    }
}