"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("holiday_database", "custom_holiday", {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("holiday_database", "custom_holiday");
    }
};
