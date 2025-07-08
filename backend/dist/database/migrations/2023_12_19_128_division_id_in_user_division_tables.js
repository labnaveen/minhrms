"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("user_division", "division_id", {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("user_division", "division_id");
    }
};
