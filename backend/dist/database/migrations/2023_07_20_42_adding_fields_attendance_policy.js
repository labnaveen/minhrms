"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("attendance_policy", "mobile_app_restriction", {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }),
            await queryInterface.addColumn("attendance_policy", "number_of_devices_allowed", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("attendance_policy", "mobile_app_restriction");
        await queryInterface.deleteColumn("attendance_policy", "number_of_devices_allowed");
    },
};
