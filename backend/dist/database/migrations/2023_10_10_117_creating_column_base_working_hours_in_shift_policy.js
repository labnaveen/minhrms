"use strict";
//@ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("shift_policy", "base_working_hours", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true
        }),
            await queryInterface.changeColumn("shift_policy", "number_of_days_flexi_allowed", {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("shift_policy", "base_working_hours");
        await queryInterface.changeColumn("shift_policy", "number_of_days_flexi_allowed", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        });
    }
};
