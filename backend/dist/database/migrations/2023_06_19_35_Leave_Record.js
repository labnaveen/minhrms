"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable("leave_record", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true
            },
            user_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            leave_type_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            day_type_id: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            start_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false
            },
            end_date: {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: false,
            },
            reason: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            document: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            contact_number: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            is_deleted: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            created_at: {
                type: sequelize_1.DataTypes.DATE,
            },
            updated_at: {
                type: sequelize_1.DataTypes.DATE,
            },
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable("leave_record");
    },
};
