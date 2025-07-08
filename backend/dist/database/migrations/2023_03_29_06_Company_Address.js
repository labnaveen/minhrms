"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        // logic for transforming into the new state
        await queryInterface.createTable('company_address', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            company_present_address: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            company_present_pincode: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            company_present_city: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            company_present_state: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            company_present_country_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            company_present_mobile: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            company_permanent_address: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            company_permanent_pincode: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            company_permanent_city: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            company_permanent_state: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            company_permanent_country_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            company_permanent_mobile: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            company_id: {
                type: sequelize_1.DataTypes.INTEGER,
                references: { model: 'company', key: 'id' }
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
        await queryInterface.dropTable('company_address');
    }
};
