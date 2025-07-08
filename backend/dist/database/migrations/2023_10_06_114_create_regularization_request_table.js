"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('regularization_record', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            in_time: {
                type: sequelize_1.DataTypes.TIME,
                allowNull: false
            },
            out_time: {
                type: sequelize_1.DataTypes.TIME,
                allowNull: false
            },
            request_status: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'attendance_status', key: 'id' }
            },
            reason: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
                references: { model: 'approval_status', key: 'id' }
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
        await queryInterface.dropTable('regularization_record');
    }
};
