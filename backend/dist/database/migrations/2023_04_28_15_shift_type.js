"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('shift_type', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            is_deleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
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
        await queryInterface.dropTable('shift_type');
    }
};
