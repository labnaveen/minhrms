"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('punch_location', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            attendance_log_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'attendance', key: 'id' }
            },
            punch_time: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            latitude: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            longitude: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            location: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true
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
        await queryInterface.dropTable('punch_location');
    }
};
