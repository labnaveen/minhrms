"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('profile_change_request', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            profile_change_record_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'profile_change_record', key: 'id' }
            },
            reporting_manager_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'reporting_managers', key: 'id' }
            },
            status: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'approval_status', key: 'id' },
                defaultValue: 1
            },
            priority: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
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
        await queryInterface.dropTable('profile_change_request');
    }
};
