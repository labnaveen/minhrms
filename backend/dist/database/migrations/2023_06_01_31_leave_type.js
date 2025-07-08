"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable("leave_type", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                unique: true,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            base_leave_configuration_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            leave_type_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            negative_balance: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            max_leave_allowed_in_negative_balance: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            max_days_per_leave: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            max_days_per_month: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            allow_half_days: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            application_on_holidays: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            restriction_for_application: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            limit_back_dated_application: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            notice_for_application: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            auto_approval: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            auto_action_after: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            auto_approval_action: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            supporting_document_mandatory: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            prorated_accrual_first_month: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            prorated_rounding: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            prorated_rounding_factor: {
                type: sequelize_1.DataTypes.DECIMAL,
            },
            encashment_yearly: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            max_leaves_for_encashment: {
                type: sequelize_1.DataTypes.DECIMAL,
            },
            carry_forward_yearly: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            carry_forward_rounding: {
                type: sequelize_1.DataTypes.INTEGER
            },
            carry_forward_rounding_factor: {
                type: sequelize_1.DataTypes.DECIMAL
            },
            intra_cycle_carry_forward: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            prefix_postfix_weekly_off_sandwhich_rule: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            prefix_postfix_holiday_sandwhich_rule: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            inbetween_weekly_off_sandwhich_rule: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
            },
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable("leave_type");
    },
};
