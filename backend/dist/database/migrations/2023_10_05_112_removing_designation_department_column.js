"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.removeColumn("user", "designation"),
            await queryInterface.removeColumn("user", "department");
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("user", "designation", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true
        }),
            await queryInterface.addColumn("user", "department", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            });
    },
};
