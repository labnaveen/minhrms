"use strict";
//@ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        // logic for transforming into the new state
        await queryInterface.createTable('company', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                unique: true,
                autoIncrement: true
            },
            company_name: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            company_email: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            company_mobile: {
                type: sequelize_1.DataTypes.BIGINT,
                allowNull: false
            },
            teamsize: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            industry_id: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            domain: {
                type: sequelize_1.DataTypes.CHAR,
                allowNull: false,
                unique: true
            },
            pan: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            gst: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
            },
            company_prefix: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false
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
        await queryInterface.dropTable('company');
    }
};
