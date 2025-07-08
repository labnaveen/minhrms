"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('employment_type', {
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
            created_at: {
                type: sequelize_1.DataTypes.DATE
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE
            }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('employment_type');
    }
};
