"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("shift_policy", "shift_start_time", {
            type: sequelize_1.DataTypes.TIME,
            allowNull: true
        }),
            await queryInterface.changeColumn("shift_policy", "shift_end_time", {
                type: sequelize_1.DataTypes.TIME,
                allowNull: true
            }),
            await queryInterface.changeColumn("shift_policy", "pre_shift_duration", {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true
            }),
            await queryInterface.changeColumn("shift_policy", "post_shift_duration", {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true
            }),
            await queryInterface.changeColumn("shift_policy", "break_duration", {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true
            }),
            await queryInterface.changeColumn("shift_policy", "break_start_time", {
                type: sequelize_1.DataTypes.TIME,
                allowNull: true
            }),
            await queryInterface.changeColumn("shift_policy", "break_end_time", {
                type: sequelize_1.DataTypes.TIME,
                allowNull: true
            }),
            await queryInterface.changeColumn("shift_policy", "flex_start_time", {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true
            }),
            await queryInterface.changeColumn("shift_policy", "flexi_duration_allowed", {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("shift_policy", "working_hours", {
            type: sequelize_1.DataTypes.STRING
        });
    },
};
