"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        // logic for transforming into the new state
        await queryInterface.createTable('industry', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            name: {
                type: sequelize_1.DataTypes.TEXT,
            },
            is_deleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE
            },
        });
    },
    down: async ({ context: queryInterface }) => {
        // logic for reverting the changes
        await queryInterface.dropTable('industry');
    }
};
