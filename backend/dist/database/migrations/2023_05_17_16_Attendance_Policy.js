"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('attendance_policy', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            name: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            attendance_cycle_start: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            biometric: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            web: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            app: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            manual: {
                type: sequelize_1.DataTypes.BOOLEAN,
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
            regularisation_status: {
                type: sequelize_1.DataTypes.STRING
            },
            half_day: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            hours_half_day: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            display_overtime_hours: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_deficit_hours: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_late_mark: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_average_working_hours: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_present_number_of_days: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_absent_number_of_days: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_number_of_leaves_taken: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_average_in_time: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            display_average_out_time: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            flexibility_hours: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            call_out_regularisation: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            round_off: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            auto_approval_attendance_request: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            regularisation_restriction: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            regularisation_restriction_limit: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            regularisation_limit_for_month: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            bypass_regularisation_proxy: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            location_based_restriction: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            location_mandatory: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            location: {
                type: sequelize_1.DataTypes.STRING,
            },
            distance_allowed: {
                type: sequelize_1.DataTypes.STRING,
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE
            }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('attendance_policy');
    }
};
