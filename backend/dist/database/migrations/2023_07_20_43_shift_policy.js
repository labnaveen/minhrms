"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('shift_policy', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            shift_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            shift_description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            notes_for_punch: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            allow_single_punch: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            shift_type_id: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            shift_start_time: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            shift_end_time: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            pre_shift_duration: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            post_shift_duration: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            consider_breaks: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false
            },
            break_duration: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            break_start_time: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            break_end_time: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            enable_grace: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false
            },
            grace_duration_allowed: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            number_of_days_grace_allowed: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            status_grace_exceeded: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            enable_grace_recurring: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            enable_flex: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            flex_start_time: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            flexi_duration_allowed: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            number_of_days_flexi_allowed: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            status_flexi_exceeded: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true
            },
            exceeded_flexi_time_limit: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            enable_flex_recurring: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
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
        await queryInterface.dropTable('shift_policy');
    }
};
