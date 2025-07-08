"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('base_leave_configuration', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            policy_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            policy_description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true
            },
            leave_calendar_from: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            proxy_leave_by: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            },
            leave_request_status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            leave_balance_status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            contact_number_allowed: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            contact_number_mandatory: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            reason_for_leave: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            reason_for_leave_mandatory: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            notify_peer: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            leave_rejection_reason: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            is_deleted: {
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
        await queryInterface.dropTable('base_leave_configuration');
    }
};
