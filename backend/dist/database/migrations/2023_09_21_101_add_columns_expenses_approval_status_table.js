"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("expenses_approval_status", "border_hex_color", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        }),
            await queryInterface.addColumn("expenses_approval_status", "button_hex_color", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("expenses_approval_status", "border_hex_color");
        await queryInterface.deleteColumn("expenses_approval_status", "button_hex_color");
    }
};
