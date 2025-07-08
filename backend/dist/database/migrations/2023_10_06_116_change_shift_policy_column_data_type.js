"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("shift_policy", "number_of_days_grace_allowed", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        }),
            await queryInterface.changeColumn("shift_policy", "grace_duration_allowed", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("shift_policy", "number_of_days_grace_allowed", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        }),
            await queryInterface.changeColumn("shift_policy", "grace_duration_allowed", {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            });
    },
};
