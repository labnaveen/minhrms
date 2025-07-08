"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('assigned_asset', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'user', key: 'id' }
            },
            asset_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'asset', key: 'id' }
            },
            date_of_issue: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false
            },
            date_of_return: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: true,
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            deleted_at: {
                type: sequelize_1.DataTypes.DATE,
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
        await queryInterface.dropTable('assigned_asset');
    }
};
