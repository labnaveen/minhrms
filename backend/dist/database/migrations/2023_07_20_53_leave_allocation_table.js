"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('leave_allocation', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true
            },
            leave_type_policy_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            month_number: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            allocated_leaves: {
                type: sequelize_1.DataTypes.INTEGER,
                AllowNull: false
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
        await queryInterface.dropTable('leave_allocation');
    }
};
