"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("leave_balance", "total_leaves", {
            type: sequelize_1.DataTypes.FLOAT,
            defaultValue: false,
            allowNull: false
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("leave_balance", "total_leaves");
    }
};
