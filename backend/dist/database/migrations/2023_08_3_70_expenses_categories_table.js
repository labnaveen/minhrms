"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('expenses_categories', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            category_name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('expenses_categories');
    }
};
