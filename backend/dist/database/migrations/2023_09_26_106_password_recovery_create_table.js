"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('password_recovery', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            phone: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            otp: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            sent_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            expires_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
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
        await queryInterface.dropTable('password_recovery');
    }
};
