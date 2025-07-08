"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('attendance', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            employee_generated_id: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
            },
            punch_in_time: {
                type: sequelize_1.DataTypes.TIME,
            },
            punch_out_time: {
                type: sequelize_1.DataTypes.TIME,
            },
            status: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
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
        await queryInterface.dropTable('attendance');
    }
};
