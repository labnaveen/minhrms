"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("expenses", "billing_status", {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("expenses", "billing_status", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        });
    },
};
