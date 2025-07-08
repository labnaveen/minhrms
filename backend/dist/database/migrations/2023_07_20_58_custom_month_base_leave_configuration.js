"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("base_leave_configuration", "custom_month", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn("base_leave_configuration", "custom_month");
    },
};
