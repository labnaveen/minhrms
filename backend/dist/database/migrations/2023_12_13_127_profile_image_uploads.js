"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('profile_images', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            path: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            public_url: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            status: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 2
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
        await queryInterface.dropTable('profile_images');
    }
};
