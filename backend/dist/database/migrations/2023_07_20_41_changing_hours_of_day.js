"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn("attendance_policy", "hours_half_day", "min_hours_for_half_day"),
            await queryInterface.changeColumn("attendance_policy", "min_hours_for_half_day", {
                type: sequelize_1.DataTypes.FLOAT,
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn("attendance_policy", "min_hours_for_half_day", "hours_half_day");
        await queryInterface.changeColumn("attendance_policy", "hours_half_day", {
            type: sequelize_1.DataTypes.STRING
        });
    },
};
