"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("division", "system_generated", {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }),
            await queryInterface.addColumn("division_units", "system_generated", {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("division", "system_generated");
        await queryInterface.deleteColumn("division_units", "system_generated");
    }
};
