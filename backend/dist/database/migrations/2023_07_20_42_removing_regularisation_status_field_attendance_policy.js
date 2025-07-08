"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn("attendance_policy", "regularisation_status");
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("attendance_policy", "regularisation_status", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        });
    },
};
