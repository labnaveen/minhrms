"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('experience', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'user', key: 'id' }
            },
            company_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            designation: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            employment_type_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'employment_type', key: 'id' }
            },
            start_date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            end_date: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
            },
            address: {
                type: sequelize_1.DataTypes.STRING,
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
        await queryInterface.dropTable('experience');
    }
};
