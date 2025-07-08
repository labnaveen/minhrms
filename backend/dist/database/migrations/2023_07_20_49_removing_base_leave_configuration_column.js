"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn("leave_type", "base_leave_configuration_id");
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("leave_type", "base_leave_configuration_id", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        });
    },
};
