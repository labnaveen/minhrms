"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("shift_policy", "status_flexi_exceeded", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("shift_policy", "status_flexi_exceeded", {
            type: sequelize_1.DataTypes.STRING
        });
    },
};
