"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("user", "employee_generated_id", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("user", "employee_generated_id");
    }
};
