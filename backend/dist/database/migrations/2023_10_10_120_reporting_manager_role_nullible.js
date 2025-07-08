"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("user", "reporting_role_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        }),
            await queryInterface.changeColumn("user", "reporting_manager_id", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("user", "reporting_role_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        }),
            await queryInterface.changeColumn("user", "reporting_manager_id", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            });
    },
};
