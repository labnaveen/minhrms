"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('regularisation_status', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            name: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            is_deleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                defaultValue: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
            }
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('regularisation_status');
    }
};
