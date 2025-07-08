"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        // logic for transforming into the new state
        await queryInterface.createTable('employee_address', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            employee_present_address: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            employee_present_pincode: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            employee_present_city: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            employee_present_state: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            employee_present_country_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            employee_present_mobile: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            employee_permanent_address: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            employee_permanent_pincode: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            employee_permanent_city: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            employee_permanent_state: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            employee_permanent_country_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            employee_permanent_mobile: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: 'user', key: 'id' }
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
        await queryInterface.dropTable('employee_address');
    }
};
