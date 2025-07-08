"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn("user", "employee_gender", "employee_gender_id"),
            await queryInterface.changeColumn("user", "employee_gender_id", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.renameColumn("user", "employee_gender_id", "employee_gender"),
            await queryInterface.changeColumn("user", "employee_gender_id", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            });
    },
};
