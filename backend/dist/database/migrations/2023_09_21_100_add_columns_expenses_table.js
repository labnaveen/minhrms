"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("expenses", "stay_from_date", {
            type: sequelize_1.DataTypes.DATEONLY,
            allowNull: true
        }),
            await queryInterface.addColumn("expenses", "stay_to_date", {
                type: sequelize_1.DataTypes.DATEONLY,
                allowNull: true
            });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("expenses", "stay_from_date");
        await queryInterface.deleteColumn("expenses", "stay_to_date");
    }
};
