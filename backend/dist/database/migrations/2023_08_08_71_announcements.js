"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('announcement', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            title: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            suspendable: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            group_specific: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            start_date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true
            },
            end_date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true
            },
            deleted_at: {
                type: sequelize_1.DataTypes.DATE
            }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('announcement');
    }
};
