"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const sequelize_1 = require("sequelize");
module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.addColumn("user", "phone", {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        });
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.deleteColumn("user", "phone");
    }
};
