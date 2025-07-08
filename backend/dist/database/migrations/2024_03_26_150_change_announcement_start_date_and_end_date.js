"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("announcement", "start_date", {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true,
        }),
            await queryInterface.changeColumn("announcement", "end_date", {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: true,
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.changeColumn("announcement", "start_date", {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        }),
            await queryInterface.changeColumn("announcement", "end_date", {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true
            });
    },
};
