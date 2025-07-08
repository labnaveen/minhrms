"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('leave_type_policy', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            leave_policy_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            accrural_frequency: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            accrural_type: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            accrural_from: {
                type: sequelize_1.DataTypes.INTEGER,
            },
            advance_accrual_for_entire_leave_year: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            annual_eligibility: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true,
            },
            annual_breakup: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
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
        await queryInterface.dropTable('leave_type_policy');
    }
};
